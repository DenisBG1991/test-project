import {Component, OnInit, ViewChild} from '@angular/core';
import {IIssue, IIssueRef, IssueActions} from '@app/store/issue';
import {NgRedux} from '@angular-redux/store';
import {IAppState} from '@app/store/store';
import {Observable} from 'rxjs/Observable';
import {PermissionEnum} from '@app/store/permission';
import {PermissionSelectors} from '@app/store/permission/permission.selectors';
import {ActivatedRoute, Params} from '@angular/router';
import {ValidationService} from '@app/services/validation.service';
import {FormGroup} from '@angular/forms';
import {ILabel} from '@app/store/label';
import {IPerson} from '@app/store/person/person.model';
import {ICollegialBody} from '@app/store/collegial-body/collegial-body.model';
import {ButtonType} from '@app/presentation/ui-kit/button/button.component';
import {LabelActions} from '@app/store/label/label.actions';
import {PersonActions} from '@app/store/person/person.actions';
import {PopupComponent} from '@app/presentation/ui-kit/popup/popup.component';
import {IssueSharePersonActions} from '@app/store/issue-share-person/issue-share-person.actions';
import {findPersonsByQuery} from '@app/store/person/person.selectors';
import {ConfirmService} from '@app/presentation/ui-kit/confirm/confirm.service';

@Component({
    selector: 'senat-issue-page-header',
    templateUrl: './issue-page-header.component.html',
    styleUrls: ['./issue-page-header.component.css']
})
export class IssuePageHeaderComponent implements OnInit {

    @ViewChild('sharePopup') sharePopup: PopupComponent;
    formGroup: FormGroup;

    buttonType = ButtonType;
    permissions = PermissionEnum;

    personsQuery = '';
    labelsQuery = '';

    issue: IIssueRef;

    issue$: Observable<IIssue> =
        this._ngRedux.select(x => x.issue.issue);

    actions$: Observable<string[]> =
        this._ngRedux.select(x => x.issue.issue ? x.issue.issue.status : '')
            .map(s => this.getActions(s));

    editMode$: Observable<boolean> =
        this._ngRedux.select(x => x.layout.issue.editMode);

    suggestedPersons$: Observable<Array<IPerson>> =
        this._ngRedux.select(x => x.persons)
            .map(x => findPersonsByQuery(x, this.personsQuery))
            .filter(f => !!f);


    sharePersons$: Observable<IPerson[]> =
        this._ngRedux.select(x => x.issueSharePersons
            .filter(p => p.issue.id === this.issue.id)
            .map(p => x.persons.find(person => person.id === p.id)));


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


    constructor(private _route: ActivatedRoute,
                private _ngRedux: NgRedux<IAppState>,
                private _issueActions: IssueActions,
                private _permissionSelectors: PermissionSelectors,
                private _validationService: ValidationService,
                private _labelActions: LabelActions,
                private _issueSharePersonActions: IssueSharePersonActions,
                private _personActions: PersonActions,
                private _confirmServie: ConfirmService) {
    }

    ngOnInit() {
        this._route.params.subscribe((params: Params) => {
            this.issue = {
                id: params['id']
            };
        });

        this.issue$.subscribe(issue => {
            if (issue) {
                this.formGroup = this._validationService.createFormGroup(new FormModel(issue),
                    [
                        {
                            propExpression: x => x.title,
                            validators: [
                                this._validationService.requiredMultilingual()
                            ]
                        }
                    ]);

                this.formGroup.controls['collegialBody'].disable();
            }
        });

        this._ngRedux.select(x => x.labels)
            .subscribe(labels => this.assignLabelIds(labels));
    }

    getActions(status: string): string[] {
        if (status === 'Preparing') {
            return ['ToPrepared'];
        }

        return [];
    }

    move(action: string) {
        const issueId = {
            id: this._ngRedux.getState().issue.issue.id
        };
        this._ngRedux.dispatch(this._issueActions.moveIssueState(issueId, action));
    }

    hasPermission$(permission: PermissionEnum): Observable<boolean> {
        return this._ngRedux.select(this._permissionSelectors.issueHasPermision(permission, this.issue));
    }

    edit() {
        this._ngRedux.dispatch(this._issueActions.changeIssueEditMode(true));
    }

    save() {
        const formValue: FormModel = this.formGroup.value;

        const issue: IIssue = {
            id: formValue.id,
            collegialBody: formValue.collegialBody,
            title: formValue.title,
            description: formValue.description,
            author: formValue.author,
            estimate: `${formValue.estimate.getHours()}:${formValue.estimate.getMinutes()}:00`,
            status: null,
            labels: formValue.labels
        };

        this._ngRedux.dispatch(this._issueActions.updateIssue(issue));
    }

    discard() {
        this._ngRedux.dispatch(this._issueActions.changeIssueEditMode(false));
    }

    delete() {
        this._confirmServie.confirm('Удалить вопрос?', () => {
            this._ngRedux.dispatch(this._issueActions.deleteIssue(this.issue));
        });
    }

    findPeople(query: string) {
        this.personsQuery = query;
        this._ngRedux.dispatch(this._personActions.loadPersons(query));
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


    showShare() {
        this._ngRedux.dispatch(this._issueSharePersonActions.loadSharePersons(this.issue));
        this.sharePopup.show();
    }

    removeSharePerson(person: IPerson) {
        this._ngRedux.dispatch(this._issueSharePersonActions.removeSharePerson(this.issue, person));
    }

    addSharePerson(person: IPerson) {
        this._ngRedux.dispatch(this._issueSharePersonActions.addSharePerson(this.issue, person));
    }
}

class FormModel {
    id: string = null;
    collegialBody: ICollegialBody = null;
    title: { [key: string]: string } = null; // без null в созданном объекте не будет полей вообще! да, это фронт энд, детка
    description: { [key: string]: string } = null; // а без полей не может быть создана форма, т.к. formControl не будет существовать
    author: IPerson = null;
    labels: Array<ILabel> = [];
    estimate: Date;

    constructor(issue: IIssue) {
        this.id = issue.id;
        this.collegialBody = issue.collegialBody;
        this.title = issue.title;
        this.description = issue.description;
        this.estimate = new Date(`2000-01-01T${issue.estimate}`);
        this.author = issue.author;
        this.labels = issue.labels;
    }
}
