import { NgModule } from '@angular/core';

import { DevToolsExtension, NgRedux, NgReduxModule } from '@angular-redux/store';
import { NgReduxRouter, NgReduxRouterModule } from '@angular-redux/router';

import { AdUserActions } from '@app/store/admin/ad-user/ad-user.actions';
import { AdUserEpics } from '@app/store/admin/ad-user/ad-user.epics';
import { PersonLayoutActions } from '@app/store/admin/layout/person-layout.actions';
import { PermissionActions } from '@app/store/admin/permission/permission.actions';
import { PermissionEpics } from '@app/store/admin/permission/permission.epic';
import { PermissionSelectors } from '@app/store/admin/permission/permission.selectors';
import { PersonActions } from '@app/store/admin/person/person.actions';
import { PersonEpics } from '@app/store/admin/person/person.epics';
import { RoleActions } from '@app/store/admin/role/role.actions';
import { RoleEpics } from '@app/store/admin/role/role.epics';
import { UserActions } from '@app/store/admin/user/user.actions';
import { UserEpics } from '@app/store/admin/user/user.epics';
import { UserRoleActions } from '@app/store/admin/user-role/user-role.actions';
import { UserRoleEpics } from '@app/store/admin/user-role/user-role.epics';

import { CollegialBodyActions } from '@app/store/collegial-body/collegial-body.actions';
import { CollegialBodyEpics } from '@app/store/collegial-body/collegial-body.epic';
import { CompanyActions } from '@app/store/company/company.actions';
import { CompanyEpics } from '@app/store/company/company.epic';
import { HoldingActions } from '@app/store/holding/holding.actions';
import { HoldingEpics } from '@app/store/holding/holding.epic';
import { ErrorActions } from '@app/store/error/error.actions';

import { createEpicMiddleware } from 'redux-observable';

import { createLogger } from 'redux-logger';

import IAdminState from '@app/store/admin/store.model';
import INITIAL_STATE from '@app/store/admin/store.adminState';
import rootReducer from '@app/store/admin/store.rootReducer';

@NgModule({
    exports: [
        // админка перетирает и создает свой state
        NgReduxModule,
        NgReduxRouterModule
    ],
    providers: [
        AdUserActions,
        AdUserEpics,
        CollegialBodyActions,
        CollegialBodyEpics,
        CompanyActions,
        CompanyEpics,
        ErrorActions,
        HoldingActions,
        HoldingEpics,
        PermissionActions,
        PermissionEpics,
        PersonActions,
        PersonEpics,
        PersonLayoutActions,
        PermissionSelectors,
        RoleActions,
        RoleEpics,
        UserActions,
        UserEpics,
        UserRoleActions,
        UserRoleEpics
    ]
})
export class StoreModule {
    constructor(ngRedux: NgRedux<IAdminState>,
                ngReduxRouter: NgReduxRouter,
                devTools: DevToolsExtension,
                private _adUserEpics: AdUserEpics,
                private _permissionEpics: PermissionEpics,
                private _personEpics: PersonEpics,
                private _roleEpics: RoleEpics,
                private _userEpics: UserEpics,
                private _userRoleEpics: UserRoleEpics,
                private _collegialBodyEpics: CollegialBodyEpics,
                private _companyEpics: CompanyEpics,
                private _holdingEpics: HoldingEpics) {

        const storeEnhancers = !devTools.isEnabled() ? [] : [devTools.enhancer()];

        const middleware = [
            createLogger(),
            createEpicMiddleware(this._adUserEpics.loadAdUsers),
            createEpicMiddleware(this._adUserEpics.loadAdUserDetailed),
            createEpicMiddleware(this._permissionEpics.loadGroupPermissions),
            createEpicMiddleware(this._personEpics.createPerson),
            createEpicMiddleware(this._personEpics.loadSinglePerson),
            createEpicMiddleware(this._personEpics.updatePerson),
            createEpicMiddleware(this._roleEpics.updateRoles),
            createEpicMiddleware(this._userEpics.createAdUser),
            createEpicMiddleware(this._userEpics.createAdPersonUser),
            createEpicMiddleware(this._userEpics.loadPersonLogins),
            createEpicMiddleware(this._userRoleEpics.createUserRole),
            createEpicMiddleware(this._userRoleEpics.deleteUserRole),
            createEpicMiddleware(this._userRoleEpics.loadUserRolePage),
            createEpicMiddleware(this._collegialBodyEpics.loadCollegialBodies),
            createEpicMiddleware(this._companyEpics.loadCompanies),
            createEpicMiddleware(this._holdingEpics.loadHoldings)
        ];

        /**Напрямую изменяем значение свойства состояния state!!!!**/
        INITIAL_STATE.currentUser = JSON.parse(localStorage.getItem('currentUser'));

        ngRedux.configureStore(
            rootReducer,
            INITIAL_STATE,
            middleware,
            storeEnhancers
        );

        ngReduxRouter.initialize();
    };
}
