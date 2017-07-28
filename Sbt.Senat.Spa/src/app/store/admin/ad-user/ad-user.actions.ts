import {Injectable} from '@angular/core';

import {IAdUser, IAdUserDetailed} from '@app/store/admin/ad-user/ad-user.model';

@Injectable()
export class AdUserActions {

    static readonly AdUsersPing = 'AD_USERS_PING';

    static readonly LoadAdUsers = 'LOAD_AD_USERS';
    static readonly LoadAdUsersComplete = 'LOAD_AD_USERS_COMPLETE';
    static readonly LoadAdUsersFail = 'LOAD_AD_USERS_FAIL';

    static readonly LoadAdUserDetailed = 'LOAD_AD_USER_DETAILED';
    static readonly LoadAdUserDetailedComplete = 'LOAD_AD_USER_DETAILED_COMPLETE';
    static readonly LoadAdUserDetailedFail = 'LOAD_AD_USER_DETAILED_FAIL';

    adUsersPing() {
        return {
            type: AdUserActions.AdUsersPing
        };
    }

    loadAdUsers(query: string) {
        return {
            type: AdUserActions.LoadAdUsers,
            payload: {
                query: query
            }
        };
    }

    loadAdUsersComplete(adUsers: IAdUser[]) {
        return {
            type: AdUserActions.LoadAdUsersComplete,
            payload: {
                adUsers: adUsers
            }
        };
    }

    loadAdUsersFail(error) {
        return {
            type: AdUserActions.LoadAdUsersFail,
            payload: {
                error: error
            }
        };
    }

    loadAdUserDetailed(adLogin: string) {
        return {
            type: AdUserActions.LoadAdUserDetailed,
            payload: {
                adLogin: adLogin
            }
        };
    }

    loadAdUserDetailedComplete(adUser: IAdUserDetailed) {
        return {
            type: AdUserActions.LoadAdUserDetailedComplete,
            payload: {
                adUser: adUser
            }
        };
    }

    loadAdUserDetailedFail(error) {
        return {
            type: AdUserActions.LoadAdUserDetailedFail,
            payload: {
                error: error
            }
        };
    }
}
