import {IIssue} from '@app/store/issue/issue.types';
import {IOperationState} from '@app/store/store';
import {IPagingState} from '@app/store/paging.model';
import {IIssueListFilter, IIssueListItem} from '@app/store/issue-list';


export interface IIssueListState extends IOperationState {
    filter: IIssueListFilter;
    items: Array<IIssueListItem>;
    paging: IPagingState;
}

export const INITIAL_STATE: IIssueListState = {
    filter: {},
    items: [],
    paging: {
        pageSize: 20,
        currentPage: 0,
        total: 0
    },
    errorOccurred: false,
    updating: false
};
