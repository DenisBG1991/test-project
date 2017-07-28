import {Injectable} from '@angular/core';
import {IUser} from '@app/store/user/user.model';

@Injectable()
export class SessionActions {

    static readonly Login = 'LOGIN';
    static readonly LoginComplete = 'LOGIN_COMPLETE';
    static readonly LoginFail = 'LOGIN_FAIL';
    static readonly Logout = 'LOGOUT';
    static readonly LogoutComplete = 'LOGOUT_COMPLETE';
    static readonly LogoutFail = 'LOGOUT_FAIL';
    static readonly SessionExpired = 'SESSION_EXPIRED';

    login(username: string, password: string, rememberMe: boolean) {
        return {
            type: SessionActions.Login,
            payload: {
                username: username,
                password: password,
                rememberMe: rememberMe
            }
        };
    }

    loginComplete(user: IUser) {
        return {
            type: SessionActions.LoginComplete,
            payload: {
                user: user
            }
        };
    }

    loginFail(error) {
        return {
            type: SessionActions.LoginFail,
            payload: {
                error: error
            }
        };
    }

    logout() {
        return {
            type: SessionActions.Logout
        };
    }

    logoutComplete() {
        return {
            type: SessionActions.LogoutComplete
        };
    }

    logoutFail(error) {
        return {
            type: SessionActions.LogoutFail,
            payload: {
                error: error
            }
        };
    }

    /**
     * Истечение сессии.
     */
    sessionExpired() {
        return {
            type: SessionActions.SessionExpired
        };
    }
}
