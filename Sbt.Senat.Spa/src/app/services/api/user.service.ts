import {Injectable} from '@angular/core';

import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {Observable} from 'rxjs/Observable';
import {AccountClient, UserClient, CreateAdUserDto, AdSearchFilterDto} from '@app/shared/api';
import {IAdUser, IAdUserDetailed} from '@app/store/admin/ad-user/ad-user.model';
import {IPersonRef} from '@app/store/person/person.model';
import {IPersonUser} from '@app/store/admin/user/user.model';

@Injectable()
export class UserService {

    constructor(private _client: UserClient,
                private  _accountClient: AccountClient) {
    }


    createAdUser(person: IPersonRef,
                 adLogin: string): Observable<string> {
        return this._accountClient.createAdUser(new CreateAdUserDto({
            person: {
                id: person.id
            },
            adLogin: adLogin
        }));
    }

    findAdUsers(query: string): Observable<IAdUser[]> {
        return this._accountClient.searchInAd(new AdSearchFilterDto({
                name: query
            }))
            .map(res => res.map(m => {
                return {
                    adLogin: m.adLogin,
                    firstName: m.firstName,
                    lastName: m.lastName,
                    middleName: m.middleName,
                    hasPhoto: m.hasPhoto
                };
            }));
    }

    getAdUserDetailed(adLogin: string): Observable<IAdUserDetailed> {
        return this._accountClient.getAdUser(adLogin)
            .map(m => {
                return {
                    adLogin: m.adLogin,
                    firstName: m.firstName,
                    lastName: m.lastName,
                    middleName: m.middleName,
                    email: m.email,
                    hasPhoto: m.hasPhoto,
                    userPerson: m.userPerson && m.userPerson.userId ? {
                        id: m.userPerson.userId,
                        person: {
                            id: m.userPerson.person.id
                        }
                    } : null
                };
            });
    }

    getPersonLogins(person: IPersonRef): Observable<IPersonUser> {
        return this._accountClient.getPersonLogins(person.id)
            .map(m => {
                return {
                    id: m.userId,
                    person: {
                        id: person.id
                    },
                    authMethods: m.logins
                };
            });

    }

}

