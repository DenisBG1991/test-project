import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {NgRedux} from '@angular-redux/store';
import {IAppState} from '@app/store/store';
import {Observable} from 'rxjs/Observable';
import {IIssueListItem} from '@app/store/issue-list';
import {Router} from '@angular/router';

@Component({
    selector: 'senat-issues-list',
    templateUrl: './issue-list.component.html',
    styleUrls: ['./issue-list.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class IssuesListComponent implements OnInit {


    issues$: Observable<Array<IIssueListItem>> =
        this._ngRedux.select(x => x.issueList.items);

    canFetchMore: Observable<boolean> =
        this._ngRedux.select(x => x.issueList.paging.total > x.issueList.items.length);


    constructor(private _ngRedux: NgRedux<IAppState>,
                private _router: Router) {
    }

    ngOnInit() {

    }

    navigateToIssue(issueId: number) {
        this._router.navigate([`/issues/${issueId}`]);
    }
}
