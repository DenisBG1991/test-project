import {IIssueListState, IssueListActions, INITIAL_STATE} from '@app/store/issue-list';

export function issueListReducer(state: IIssueListState = INITIAL_STATE,
                                 action): IIssueListState {

    switch (action.type) {

        case IssueListActions.LoadIssuePage: {
            return {
                updating: true,
                errorOccurred: false,
                filter: action.payload.filter,
                items: state.items,
                paging: state.paging
            };
        }

        case IssueListActions.LoadIssuePageComplete: {
            // если будет несколько запросов-ответов, то принимаем только от предыдущей страницы
            // или если новый запрос (1-ая страница).
            // Остальные игнорируются. Иначе могут быть пропуски или задвоения
            if (action.payload.page.pageNum !== 1
                && action.payload.page.pageNum + 1 !== state.paging.currentPage) {
                return state;
            }

            return {
                updating: true,
                errorOccurred: false,
                filter: state.filter,
                items: action.payload.page.pageNum === 1
                    ? action.payload.page.items
                    : state.items.concat(action.payload.page.items),
                paging: {
                    currentPage: action.payload.page.pageNum,
                    pageSize: action.payload.page.pageSize,
                    total: action.payload.page.itemsTotal
                }
            };
        }

        case IssueListActions.LoadIssuePageFail: {
            return {
                updating: false,
                errorOccurred: true,
                filter: state.filter,
                items: state.items,
                paging: state.paging
            };
        }

        default:
            return state;
    }
}
