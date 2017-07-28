import {IIssueListFilter, IIssueListItem} from '@app/store/issue-list';
import {IPage, IPageInfo} from '@app/store/paging.model';
export class IssueListActions {

    static readonly LoadIssuePage = 'LOAD_ISSUE_PAGE';
    static readonly LoadIssuePageComplete = 'LOAD_ISSUE_PAGE_COMPLETE';
    static readonly LoadIssuePageFail = 'LOAD_ISSUE_PAGE_FAIL';

    loadIssuesPage(filter: IIssueListFilter, pageToLoad: IPageInfo) {
        return {
            type: IssueListActions.LoadIssuePage,
            payload: {
                filter: filter,
                paging: pageToLoad
            }
        };
    }

    loadIssuesPageComplete(page: IPage<IIssueListItem>) {
        return {
            type: IssueListActions.LoadIssuePageComplete,
            payload: {
                page: page
            }
        };
    }

    loadIssuesPageFail(error) {
        return {
            type: IssueListActions.LoadIssuePageFail,
            payload: {
                error: error
            }
        };
    }
}
