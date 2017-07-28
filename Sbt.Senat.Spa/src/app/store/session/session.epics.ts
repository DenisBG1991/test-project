import {Injectable} from '@angular/core';
import {SessionActions} from '@app/store/session/session.actions';
import {LoginService} from '@app/services/api/login.service';
import {ErrorActions} from '@app/store/error/error.actions';
import {Observable} from 'rxjs/Observable';
import 'rxjs/observable/concat';
import 'rxjs/observable/of';

@Injectable()
export class SessionEpics {
    constructor(private _sessionActions: SessionActions,
                private _loginService: LoginService,
                private _errorActions: ErrorActions) {

    }

    login = action$ => action$
        .ofType(SessionActions.Login)
        .switchMap(action => this._loginService.login(action.payload.username, action.payload.password, action.payload.rememberMe)
            .map(user => this._sessionActions.loginComplete(user))
            .catch(error => Observable.concat(
                Observable.of(this._sessionActions.loginFail(error)),
                Observable.of(this._errorActions.errorOccurred(error)))
            ));

    logout = action$ => action$
        .ofType(SessionActions.Logout)
        .switchMap(action => this._loginService.logout()
            .map(() => this._sessionActions.logoutComplete())
            .catch(error => Observable.concat(
                Observable.of(this._sessionActions.logoutFail(error)),
                Observable.of(this._errorActions.errorOccurred(error)))
            ));

    /**
     * Истечение сессии.
     * @param action$
     */
    sessionExpired = action$ => action$
        .ofType(SessionActions.SessionExpired)
        .map(() => { // именно map, а не switchMap, т.к. мы не создаём новый Observable
            return this._sessionActions.logoutComplete();
        });
}
