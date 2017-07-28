import {Component, OnInit, ChangeDetectionStrategy, ViewChild} from '@angular/core';
import {NgRedux} from '@angular-redux/store/lib/src';
import {ActivatedRoute, Params} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {PersonActions} from '@app/store/admin/person/person.actions';
import IAdminState from '@app/store/admin/store.model';
import {PermissionActions} from '@app/store/admin/permission/permission.actions';
import {PersonDetailsFormComponent} from '@app/presentation/person/person-details-form/person-details-form.component';
import {IPersonRef} from '@app/store/person/person.model';
import {IMultilingualPerson} from '@app/store/admin/person/person.model';
import {PermissionEnum} from '@app/store/permission';
import {PermissionSelectors} from '@app/store/admin/permission/permission.selectors';
import {PersonLayoutActions} from '@app/store/admin/layout/person-layout.actions';
import {interval} from 'rxjs/observable/interval';
import {FormGroup} from '@angular/forms';
import {UserActions} from '@app/store/admin/user/user.actions';
import {IPersonUser} from '@app/store/admin/user/user.model';
import {PermissionLevelEnum} from '@app/store/permission/permission.model';

@Component({
    selector: 'senat-person',
    templateUrl: './person.component.html',
    styleUrls: ['./person.component.css']
})
export class PersonComponent implements OnInit {

    formGroup: FormGroup;

    person: IPersonRef;

    pe = PermissionEnum;
    
    ple = PermissionLevelEnum;

    person$: Observable<IMultilingualPerson> =
        this._ngRedux.select(x => x.persons.find(p => p.id === this.person.id));

    editMode$: Observable<boolean> =
        this._ngRedux.select(x => x.layout.person.editMode);

    user$: Observable<IPersonUser> = this._ngRedux.select(x => x.users.find(u => u.person && u.person.id === this.person.id));

    constructor(private _route: ActivatedRoute,
                private _ngRedux: NgRedux<IAdminState>,
                private _personActions: PersonActions,
                private _userActions: UserActions,
                private _personLayoutActions: PersonLayoutActions,
                private _permissionActions: PermissionActions,
                private _permissionSelectors: PermissionSelectors) {
    }


    ngOnInit() {
        this._route.params.forEach((params: Params) => {
            this.person = {
                id: params['id'].toLowerCase()
            };

            this._ngRedux.dispatch(this._personActions.loadSinglePerson(this.person));
            this._ngRedux.dispatch(this._userActions.loadPersonLogins(this.person));

            this._ngRedux.select(x => x.layout.personForm)
                .subscribe(form => {
                    this.formGroup = form;

                    if (form) {
                        this.formGroup.valueChanges
                            .debounce(() => interval(300))
                            .subscribe(() => {
                                this._ngRedux.dispatch(this._personActions.personFormChanged(this.formGroup));
                            });
                    }
                });

        });
    }

    hasPermission$(permission: PermissionEnum): Observable<boolean> {
        return this._ngRedux.select(this._permissionSelectors.hasAnyPermissions([permission]));
    }


    discard() {
        this._ngRedux.dispatch(this._personLayoutActions.changePersonLayoutEditMode(false));
    }

    edit() {
        this._ngRedux.dispatch(this._personLayoutActions.changePersonLayoutEditMode(true));
    }

    delete() {

        if (confirm('Удалить?')) {
            this._ngRedux.dispatch(this._personActions.deletePerson(this.person));
        }
    }

    save() {
        this._ngRedux.dispatch(this._personActions.updatePerson(this.formGroup));
    }


}
