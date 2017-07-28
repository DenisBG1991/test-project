import { Injectable, Inject } from '@angular/core';

import { ErrorActions } from '@app/store/error/error.actions';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounce';
import 'rxjs/observable/of';

import { UserActions } from '@app/store/admin/user/user.actions';
import { UserService } from '@app/services/api/user.service';
import { AdUserActions } from '@app/store/admin/ad-user/ad-user.actions';

import { AppConfigInjectionToken, IAppConfig } from '@app/config';

@Injectable()
export class AdUserEpics {
    private baseUrl: string;

    constructor(private _userService: UserService,
                private _userActions: UserActions,
                private _adUserActions: AdUserActions,
                private _errorActions: ErrorActions,
                @Inject(AppConfigInjectionToken) appConfig: IAppConfig) {
        this.baseUrl = appConfig.api.baseUrl;
    }


    loadAdUsers = action$ => action$
        .ofType(AdUserActions.LoadAdUsers)
        .switchMap(action =>
            this._userService.findAdUsers(action.payload.query)
                .map(users => {
                    const pUsers = users.map(m => {
                        if (m.hasPhoto) {
                            m.pictureUrl = '/api/account/AdUserPhoto/?adLogin=' + m.adLogin;
                        }
                        return m;
                    });
                    return this._adUserActions.loadAdUsersComplete(pUsers);
                })
                .catch(error => Observable.concat(
                    Observable.of(this._adUserActions.loadAdUsersFail(error)),
                    Observable.of(this._errorActions.errorOccurred(error))
                )));

    loadAdUserDetailed = (action$) => action$
        .ofType(AdUserActions.LoadAdUserDetailed)
        .switchMap(action => this._userService.getAdUserDetailed(action.payload.adLogin)
            .flatMap(user => {
                if (user.userPerson && user.userPerson.id) {
                    return Observable.concat(
                        Observable.of(this._adUserActions.loadAdUserDetailedComplete(user)),
                        Observable.of(this._userActions.loadUserComplete({
                            id: user.userPerson.id,
                            person: user.userPerson.person,
                            authMethods: {'ad': action.payload.adLogin}
                        }))
                    );
                } else {
                    return Observable.of(this._adUserActions.loadAdUserDetailedComplete(user));
                }
            })
            .catch(error => Observable.concat(
                Observable.of(this._adUserActions.loadAdUserDetailedFail(error)),
                Observable.of(this._errorActions.errorOccurred(error))
            )));
}
