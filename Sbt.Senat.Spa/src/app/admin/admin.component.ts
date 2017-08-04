import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { NgRedux } from '@angular-redux/store';

import { Subscription } from 'rxjs/Subscription';

import IAdminState from '@app/store/admin/store.model';

import { PermissionActions } from '@app/store/admin/permission/permission.actions';

import { AppConfigInjectionToken, IAppConfig } from '@app/config';

@Component({
    selector: 'senat-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy {
    private _subscriptions: Subscription[];
    baseUrl: string;

    constructor(
                private _ngRedux: NgRedux<IAdminState>,
                private _permissionActions: PermissionActions,
                @Inject(AppConfigInjectionToken) appConfig: IAppConfig) {

        this.baseUrl = appConfig.api.baseUrl;

        this._subscriptions = [
            this._ngRedux.select(s => s.currentUser)
                .subscribe(u => {
                    if (u) {
                        this._ngRedux.dispatch(this._permissionActions.loadGroupPermissions());
                    } else {
                    }
                }),
        ];
    }

    ngOnInit() {}

    ngOnDestroy() {
        this._subscriptions.forEach(s => s.unsubscribe());
    }
}
