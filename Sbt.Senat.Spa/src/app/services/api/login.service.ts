import {Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {FormValidationException} from '@app/services/api/validation.error';
import {IUser} from '@app/store/user/user.model';

import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {Observable} from 'rxjs/Observable';
import {CustomHttp} from '@app/services/api/http';

@Injectable()
export class LoginService extends ApiService {

    constructor(http: CustomHttp) {
        super(http);
    }

    /**
     * Выполняет логин. Ищет данные пользователя в localStorage. Если их там нет, отправляет запрос на сервер.
     * @param username
     * @param password
     * @param rememberMe
     * @returns {Promise<IUser>}
     */
    login(username: string, password: string, rememberMe: boolean): Observable<IUser> {
        return this.http.post(`api/account/login`,
            {
                username: username,
                password: password,
                rememberMe: rememberMe
            }, this.defaultRequestOptions)
            .flatMap(() => {
                return this.http.get(`api/user/current`, this.defaultRequestOptions);
            })
            .map(response => {
                const employee: {
                    id: string,
                    firstName: string,
                    lastName: string,
                    middleName: string,
                    pictureUrl: string,
                    userId: string,
                    username: string
                } = response.json();

                return {
                    id: employee.id,
                    firstName: employee.firstName,
                    lastName: employee.lastName,
                    middleName: employee.middleName,
                    pictureUrl: employee.pictureUrl,
                    userId: employee.userId,
                    username: employee.username
                };
            })
            .catch(response => {
                if (response.status === 400) {
                    throw new FormValidationException(response);
                }

                throw response;
            });
    }

    logout(): Observable<void> {
        return this.http.post(`api/account/logout`, null, this.defaultRequestOptions)
            .map(() => {
            });
    }
}
