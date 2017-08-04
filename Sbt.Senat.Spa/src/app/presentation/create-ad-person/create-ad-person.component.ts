import {Component, Inject, OnInit} from '@angular/core';
import IAdminState from '@app/store/admin/store.model';
import {NgRedux} from '@angular-redux/store';
import {UserActions} from '@app/store/admin/user/user.actions';
import {Observable} from 'rxjs/Observable';
import {IAdUser, IAdUserDetailed} from '@app/store/admin/ad-user/ad-user.model';
import {AppConfigInjectionToken, IAppConfig} from '@app/config';
import {AdUserActions} from '@app/store/admin/ad-user/ad-user.actions';
import {PermissionEnum} from '@app/store/permission';
import {PermissionSelectors} from '@app/store/admin/permission/permission.selectors';

@Component({
    selector: 'senat-create-ad-person',
    templateUrl: './create-ad-person.component.html',
    styleUrls: ['./create-ad-person.component.css']
})
export class CreateAdPersonComponent implements OnInit {

    query: string;
    selected: IAdUser;
    baseUrl: string;
    adUsers$: Observable<IAdUser[]> = this._ngRedux
        .select(x => x.adUsers
            .filter(f => !!this.query && (f.lastName + ' ' + f.firstName + ' ' + f.middleName)
                .toLowerCase().includes((this.query || '').toLowerCase())));

    adUser$: Observable<IAdUserDetailed> = this._ngRedux
        .select(x => x.adUsersDetailed.find(f => !!this.selected && f.adLogin === this.selected.adLogin));

    canCreate$: Observable<boolean> = this._ngRedux
        .select(x => !x.users.some(u => !!this.selected && u.authMethods && u.authMethods['ad'] === this.selected.adLogin));

    hasCreatePermission$: Observable<boolean> = this._ngRedux
        .select(this._permissionSelectors.hasAnyPermissions([PermissionEnum.CreatePerson]));

    constructor(private _ngRedux: NgRedux<IAdminState>, private _userActions: UserActions,
                private _adUserActions: AdUserActions,
                private _permissionSelectors: PermissionSelectors,
                @Inject(AppConfigInjectionToken) appConfig: IAppConfig) {
        this.baseUrl = appConfig.api.baseUrl;
    }


    ngOnInit() {
    }

    findAdUsers(query: string) {
        this.query = query;
        this._ngRedux.dispatch(this._adUserActions.adUsersPing());
        if (!query || query.length < 3) {
            return;
        }
        this._ngRedux.dispatch(this._adUserActions.loadAdUsers(query));
    }

    getAdUserDetailed(adUsers: IAdUser[]) {
        this.selected = adUsers[0];
        if (this.selected) {
            this._ngRedux.dispatch(this._adUserActions.loadAdUserDetailed(this.selected.adLogin));
        }
    }

    create() {
        if (this.selected) {
            this._ngRedux.dispatch(this._userActions.createAdPersonUser(
                {
                    id: null,
                    firstName: {'ru-RU': this.selected.firstName},
                    lastName: {'ru-RU': this.selected.lastName},
                    middleName: {'ru-RU': this.selected.middleName},
                    pictureUrl: ''
                },
                this.selected.adLogin));
        }
    }
}
