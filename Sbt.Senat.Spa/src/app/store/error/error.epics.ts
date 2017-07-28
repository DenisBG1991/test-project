import {ErrorActions} from '@app/store/error/error.actions';
import {Injectable} from '@angular/core';
import {SessionActions} from '@app/store/session/session.actions';

@Injectable()
export class ErrorEpics {

    constructor(private _sessionActions: SessionActions) {
    }

    /**
     * Общий глобальный обработчик ошибок.
     * @param action$
     */
    handleError = action$ => action$
        .ofType(ErrorActions.ErrorOccurred)
        .map(action => { // именно map, а не switchMap, т.к. мы не создаём новый Observable
            const error = action.payload.error;

            if (error.status === 401 || (error.response && error.response.status === 401)) {
                return this._sessionActions.sessionExpired();
            }

            return { // если вернуть исходный action, он снова придёт в этот же middleware, и будет бесконечный цикл
                type: 'PING'
            };
        });
}
