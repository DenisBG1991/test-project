import {Observable} from 'rxjs/Observable';
import 'rxjs/observable/concat';
import 'rxjs/observable/of';
import {IssueSharePersonActions} from '@app/store/issue-share-person/issue-share-person.actions';
import {PersonActions} from '@app/store/person/person.actions';
import {ErrorActions} from '@app/store/error/error.actions';
import {Injectable} from '@angular/core';
import {IssueService} from '@app/services/api/issue.service';

@Injectable()
export class IssueSharePersonEpics {
    constructor(private _issueService: IssueService,
                private _personActions: PersonActions,
                private _issueSharePersonActions: IssueSharePersonActions,
                private _errorActions: ErrorActions) {

    }

    /**
     * Загрузка пользователей с доступом
     */
    loadSharePersons = action$ => action$
        .ofType(IssueSharePersonActions.LoadSharePersons)
        .switchMap(action => this._issueService.getShareIssuePersons(action.payload.issue)
            .switchMap(result => {
                return Observable.concat(
                    Observable.of(this._personActions.loadPersonsComplete(result)),
                    Observable.of(this._issueSharePersonActions.loadSharePersonsComplete(action.payload.issue, result))
                );
            })
            .catch(error => Observable.of(this._errorActions.errorOccurred(error))));


    addSharePerson = action$ => action$
        .ofType(IssueSharePersonActions.AddSharePerson)
        .switchMap(action => this._issueService.shareIssue(action.payload.issue, action.payload.person)
            .map(() => { // эпик обязательно должен вернуть экшн
                return {
                    type: 'PING'
                };
            })
            .catch(error => Observable.of(this._errorActions.errorOccurred(error))));

    removeSharePerson = action$ => action$
        .ofType(IssueSharePersonActions.RemoveSharePerson)
        .switchMap(action => this._issueService.deleteIssueShare(action.payload.issue, action.payload.person)
            .map(() => { // эпик обязательно должен вернуть экшн
                return {
                    type: 'PING'
                };
            })
            .catch(error => Observable.of(this._errorActions.errorOccurred(error))));
}
