import {Injectable} from '@angular/core';

import {ErrorActions} from '@app/store/error/error.actions';
import {Observable} from 'rxjs/Observable';

import 'rxjs/add/operator/debounce';
import 'rxjs/observable/of';
import {UserActions} from '@app/store/admin/user/user.actions';
import {UserService} from '@app/services/api/user.service';
import {PersonService} from '@app/services/api/person.service';


@Injectable()
export class UserEpics {

    constructor(private _userService: UserService,
                private _userActions: UserActions,
                private _personService: PersonService,
                private _errorActions: ErrorActions) {
    }


    createAdUser = action$ => action$
        .ofType(UserActions.CreateAdUser)
        .switchMap(action =>
            this._userService.createAdUser(action.payload.person, action.payload.adLogin)
                .map(userId => this._userActions.loadUserComplete({
                    id: userId,
                    person: action.payload.person,
                    authMethods: { ad: action.payload.adLogin }
                }))
                .catch(error => Observable.concat(
                    Observable.of(this._userActions.createAdUserFail(error)),
                    Observable.of(this._errorActions.errorOccurred(error))
                )));


    createAdPersonUser = action$ => action$
        .ofType(UserActions.CreateAdPersonUser)
        .switchMap(action =>
            this._personService.createPerson(action.payload.person)
                .map(person => this._userActions.createAdUser(
                    {
                        id: person.id
                    },
                    action.payload.adLogin
                ))
                .catch(error => Observable.concat(
                    Observable.of(this._userActions.createAdUserPersonFail(error)),
                    Observable.of(this._errorActions.errorOccurred(error))
                )));

    loadPersonLogins = action$ => action$
        .ofType(UserActions.LoadPersonLogins)
        .switchMap(action =>
            this._userService.getPersonLogins(action.payload.person)
                .map(person => this._userActions.loadUserComplete(person))
                .catch(error => Observable.concat(
                    Observable.of(this._userActions.createAdUserPersonFail(error)),
                    Observable.of(this._errorActions.errorOccurred(error))
                )));

}
