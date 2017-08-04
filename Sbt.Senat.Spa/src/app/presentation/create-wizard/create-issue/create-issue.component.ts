import {Location} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {FormGroup, Validators} from '@angular/forms';
import {ButtonType} from '@app/presentation/ui-kit/button/button.component';
import {BackNavigationService} from '@app/services/back-navigation.service';
import {ILabel} from '@app/store/label';
import {Observable} from 'rxjs/Observable';
import {IIssue, IssueActions} from '@app/store/issue';
import {PersonActions} from '@app/store/person/person.actions';
import {NgRedux} from '@angular-redux/store';
import {ValidationService} from '@app/services/validation.service';
import {IAppState} from '@app/store/store';
import {CollegialBodyActions} from '@app/store/collegial-body/collegial-body.actions';
import {PermissionEnum} from '@app/store/permission';
import {PermissionSelectors} from '@app/store/permission/permission.selectors';
import {interval} from 'rxjs/observable/interval';
import {LabelActions} from '@app/store/label/label.actions';
import {ICollegialBody} from '@app/store/collegial-body/collegial-body.model';
import {IPerson} from '@app/store/person/person.model';
import {findPersonsByQuery} from '@app/store/person/person.selectors';

@Component({
    selector: 'senat-create-issue',
    templateUrl: './create-issue.component.html',
    styleUrls: ['./create-issue.component.css']
})
export class CreateIssueComponent implements OnInit {

    buttonType = ButtonType;

    query = '';

    labelsQuery = '';

    formGroup: FormGroup;

    /**
     * Form can be submitted only if all the new labels has been created.
     * @returns {FormGroup|boolean}
     */
    get allLabelsCreated(): boolean {
        return this.formGroup && !this.formGroup.value.labels.some(l => l.id == null);
    }

    showLoadingIndicator$: Observable<boolean> =
        this._ngRedux.select(x => x.layout.issue.issueBeingCreated);

    collegialBodies$: Observable<Array<ICollegialBody>>
        = this._ngRedux.select(this._permissionSelectors.collegialBodyPermissionFilter(PermissionEnum.CreateIssue));

    suggestedPersons$: Observable<Array<IPerson>> =
        this._ngRedux.select(x => x.persons)
            .map(x => findPersonsByQuery(x, this.query))
            .filter(f => !!f);

    //noinspection JSUnusedGlobalSymbols
    /**
     * Filters labels from store by current query value (except already selected labels) and orders it by name.
     */
    suggestedLabels$: Observable<{ self: Array<ILabel>, canCreateNew: boolean }> =
        this._ngRedux.select(x => {
            if (!/^\s*$/.test(this.labelsQuery)) {
                const suggestedLabels = x.labels.filter(l => l.name.toLowerCase().indexOf(this.labelsQuery) !== -1 &&
                !this.formGroup.value.labels
                    .some(ll => ll.id === l.id))
                    .sort((one, two) => {
                        if (one.name > two.name) {
                            return 1;
                        } else if (one.name < two.name) {
                            return -1;
                        } else {
                            return 0;
                        }
                    });

                // a new label can be created if the query is not empty and there is no suggested value equals to the query
                const canCreateNew = !/^\s*$/.test(this.labelsQuery) &&
                    !suggestedLabels.some(l => l.name.toLowerCase() === this.labelsQuery.toLowerCase());

                return {
                    self: suggestedLabels,
                    canCreateNew: canCreateNew
                };

            } else {
                return {
                    self: [],
                    canCreateNew: false
                };
            }
        });

    static createFormModel() {
        return {
            title: null, // без null в созданном объекте не будет полей вообще! да, это фронт энд, детка
            description: null, // а без полей не может быть создана форма, т.к. formControl не будет существовать
            author: null,
            collegialBody: null,
            labels: [],
            estimate: new Date(2017, 1, 1, 0, 15)
        };
    }

    constructor(private _validationService: ValidationService,
                private _issueActions: IssueActions,
                private _personActions: PersonActions,
                private _ngRedux: NgRedux<IAppState>,
                private _collegialBodyActions: CollegialBodyActions,
                private _permissionSelectors: PermissionSelectors,
                private _labelActions: LabelActions,
                private _backNavigationService: BackNavigationService,
                private _location: Location) {
    }

    ngOnInit() {
        this._ngRedux.dispatch(this._collegialBodyActions.updateCollegialBodies());

        this.subscribeToFormChange();
    }

    subscribeToFormChange() {
        this._ngRedux.select(x => x.layout.createIssueForm)
            .subscribe(form => {
                if (!form) {
                    this.formGroup = this._validationService.createFormGroup(CreateIssueComponent.createFormModel(),
                        [
                            {
                                propExpression: x => x.title,
                                validators: [
                                    this._validationService.requiredMultilingual()
                                ]
                            },
                            {
                                propExpression: x => x.collegialBody,
                                validators: [
                                    Validators.required
                                ]
                            }
                        ]);
                } else {
                    this.formGroup = form;
                }

                this.formGroup.valueChanges
                    .debounce(() => interval(300))
                    .subscribe(() => {
                        this._ngRedux.dispatch(this._issueActions.createIssueFormChanged(this.formGroup));
                    });
            });

        this._ngRedux.select(x => x.labels)
            .subscribe(labels => this.assignLabelIds(labels));
    }


    findPeople(query: string) {
        this.query = query;
        this._ngRedux.dispatch(this._personActions.loadPersons(query));
    }


    submit() {
        const fv = this.formGroup.value;

        // Convert to suitable format
        const h = fv.estimate.getHours();
        const m = fv.estimate.getMinutes();

        const estimate = `${(h < 10 ? '0' : '')}${h.toString()}:${(m < 10 ? '0' : '')}${m.toString()}`;

        const issueModel: IIssue = {
            id: null,
            title: fv.title,
            description: fv.description,
            author: fv.author,
            estimate: estimate,
            labels: fv.labels,
            status: null,
            collegialBody: fv.collegialBody
        };

        this._ngRedux.dispatch(this._issueActions.createIssue(issueModel));
    }

    /**
     * Triggers label search.
     * @param query
     */
    findLabels(query: string) {

        // the query should be saved so it can be used to filter store values for suggestions list
        this.labelsQuery = query;

        if (!/^\s*$/.test(query)) {
            this._ngRedux.dispatch(this._labelActions.loadLabels(query));
        }
    }

    /**
     * Dispatches an action to create label.
     * Labels are created asynchronously. The component selects a new label with an empty id.
     * When the label is created, an id should be assigned (see assignLabelIds method below).
     * @param label
     */
    createLabel(label: ILabel) {
        this._ngRedux.dispatch(this._labelActions.createLabel(label.name));
    }

    /**
     * There is a subscription to labels collection in store.
     * When a collection is updated, an Observable publishes a new value and the subscription
     * calls this method.
     * The method fills label ids in the formGroup with values found in store (by label name).
     * @param labels
     */
    assignLabelIds(labels: Array<ILabel>) {

        if (!this.formGroup) {
            return;
        }
        
        const formLabels: Array<ILabel> = this.formGroup.value.labels;

        const labelsToUpdate = formLabels
            .filter(x => x.id == null && labels.some(l => l.name === x.name));

        if (labelsToUpdate.length === 0) {
            return;
        }

        for (const label of labelsToUpdate) {
            const existingLabel = labels.find(x => x.name === label.name);
            label.id = existingLabel.id;
        }

        // it should produce valueChanges
        // there is a subscription on valueChanges event which synchronizes the local formGroup with the store
        this.formGroup.controls['labels'].setValue(formLabels, {onlySelf: true});
    }

    back() {
        this._location.back();
    }

    close() {
        this._backNavigationService.navigateBack(2);
    }
}
