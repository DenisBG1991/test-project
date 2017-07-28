import {Injectable} from '@angular/core';
import {IssueActions} from '@app/store/issue/issue.actions';
import {IssueService} from '@app/services/api/issue.service';
import {ErrorActions} from '@app/store/error/error.actions';
import {Observable} from 'rxjs/Observable';
import 'rxjs/observable/concat';
import 'rxjs/observable/of';

@Injectable()
export class IssueEpics {

    constructor(private _issueService: IssueService,
                private _issueActions: IssueActions,
                private _errorActions: ErrorActions) {
    }


    createIssue = (action$) => action$
        .ofType(IssueActions.CreateIssue)
        .switchMap(action => this._issueService.createIssue(action.payload.issue)
            .map(permissionIssue => this._issueActions.createIssueComplete(permissionIssue))
            .catch(error => Observable.concat(
                Observable.of(this._issueActions.createIssueFail(error)),
                Observable.of(this._errorActions.errorOccurred(error))
            )));

    loadIssue = (action$) => action$
        .ofType(IssueActions.LoadIssue)
        .switchMap(action => this._issueService.getIssue(action.payload.issueRef.id)
            .map(permissionIssue => this._issueActions.loadIssueComplete(permissionIssue))
            .catch(error => Observable.concat(
                Observable.of(this._issueActions.loadIssueFail(error)),
                Observable.of(this._errorActions.errorOccurred(error))
            )));


    moveIssueState = (action$) => action$
        .ofType(IssueActions.MoveIssueState)
        .switchMap(action => this._issueService.moveIssueState(action.payload.issueRef.id, action.payload.action)
            .map(issue => this._issueActions.moveIssueStateComplete(issue))
            .catch(error => Observable.concat(
                Observable.of(this._issueActions.moveIssueStateFail(error)),
                Observable.of(this._errorActions.errorOccurred(error))
            )));


    updateIssue = (action$) => action$
        .ofType(IssueActions.UpdateIssue)
        .switchMap(action => this._issueService.editIssue(action.payload.issue.id, action.payload.issue)
            .map(issue => this._issueActions.updateIssueComplete(issue))
            .catch(error => Observable.concat(
                Observable.of(this._issueActions.updateIssueFail(error)),
                Observable.of(this._errorActions.errorOccurred(error))
            )));

    findIssues = action$ => action$
        .ofType(IssueActions.FindIssues)
        .switchMap(action => this._issueService.findIssues(action.payload.collegialBody, action.payload.query)
            .map(issues => this._issueActions.findIssuesComplete(issues))
            .catch(error => Observable.of(this._errorActions.errorOccurred(error))));

    deleteIssue = (action$) => action$
        .ofType(IssueActions.DeleteIssue)
        .switchMap(action => this._issueService.delete(action.payload.issue)
            .map(() => this._issueActions.deleteIssueComplete(action.payload.issue))
            .catch(error => Observable.concat(
                Observable.of(this._issueActions.deleteIssueFail(error)),
                Observable.of(this._errorActions.errorOccurred(error))
            )));
}
