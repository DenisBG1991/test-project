import {Injectable} from '@angular/core';
import {IssueService} from '@app/services/api/issue.service';
import {IssueListActions} from '@app/store/issue-list';
import {ErrorActions} from '@app/store/error/error.actions';
import {Observable} from 'rxjs/Observable';
import 'rxjs/observable/concat';
import 'rxjs/observable/of';

@Injectable()
export class IssueListEpics {

    constructor(private _issueService: IssueService,
                private _issueListActions: IssueListActions,
                private _errorActions: ErrorActions) {
    }

    loadIssues = (action$) => action$
        .ofType(IssueListActions.LoadIssuePage)
        .switchMap(action => this._issueService.getIssues(action.payload.filter, action.payload.paging)
            .map(page => this._issueListActions.loadIssuesPageComplete(page))
            .catch(error => Observable.concat(
                Observable.of(this._issueListActions.loadIssuesPageFail(error)),
                Observable.of(this._errorActions.errorOccurred(error))
            )));
}
