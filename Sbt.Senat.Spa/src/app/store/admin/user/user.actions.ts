import {Injectable} from '@angular/core';

import {IMultilingualPerson} from '@app/store/admin/person/person.model';
import {IPersonRef} from '@app/store/person/person.model';
import {IPersonUser} from '@app/store/admin/user/user.model';
@Injectable()
export class UserActions {
    static readonly LoadUser = 'LOAD_USER';
    static readonly LoadUserComplete = 'LOAD_USER_COMPLETE';
    static readonly LoadUserFail = 'LOAD_USER_FAIL';

    static readonly LoadPersonLogins = 'LOAD_PERSON_LOGINS';
    static readonly LoadPersonLoginsFail = 'LOAD_PERSON_LOGINS_FAIL';

    static readonly CreateAdUser = 'CREATE_AD_USER';
    static readonly CreateAdUserFail = 'CREATE_AD_USER_FAIL';

    static readonly CreateAdPersonUser = 'CREATE_AD_PERSON_USER';
    static readonly CreateAdPersonUserFail = 'CREATE_AD_PERSON_USER_FAIL';

    createAdPersonUser(person: IMultilingualPerson, adLogin: string) {
        return {
            type: UserActions.CreateAdPersonUser,
            payload: {
                person: person,
                adLogin: adLogin
            }
        };
    }


    createAdUserPersonFail(error) {
        return {
            type: UserActions.CreateAdPersonUserFail,
            payload: {
                error: error
            }
        };
    }


    createAdUser(person: IPersonRef,
                 adLogin: string) {
        return {
            type: UserActions.CreateAdUser,
            payload: {
                person: person,
                adLogin: adLogin
            }
        };
    }

    loadUserComplete(user: IPersonUser) {
        return {
            type: UserActions.LoadUserComplete,
            payload: {
                user: user
            }
        };
    }

    createAdUserFail(error) {
        return {
            type: UserActions.CreateAdUserFail,
            payload: {
                error: error
            }
        };
    }


    loadPersonLogins(person: IPersonRef) {
        return {
            type: UserActions.LoadPersonLogins,
            payload: {
                person: person
            }
        };
    }

    loadPersonLoginsFail(error) {
        return {
            type: UserActions.LoadPersonLoginsFail,
            payload: {
                error: error
            }
        };
    }
}

