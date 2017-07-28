import {IssueActions} from '@app/store/issue/issue.actions';
import {IIssueState, INITIAL_STATE} from '@app/store/issue/issue.state';


export function issueReducer(state: IIssueState = INITIAL_STATE, action): IIssueState {
    switch (action.type) {

        case IssueActions.LoadIssue:
            return {
                updating: true,
                errorOccurred: false,
                issue: state.issue
            };

        case IssueActions.LoadIssueComplete:
            return {
                updating: false,
                errorOccurred: false,
                issue: action.payload.issue
            };

        case IssueActions.LoadIssueFail:
            return {
                updating: false,
                errorOccurred: true,
                issue: null
            };


        case IssueActions.MoveIssueState:
            return {
                updating: true,
                errorOccurred: false,
                issue: state.issue
            };

        case IssueActions.MoveIssueStateComplete:
            return {
                updating: false,
                errorOccurred: false,
                issue: action.payload.issue
            };

        case IssueActions.MoveIssueStateFail:
            return {
                updating: false,
                errorOccurred: true,
                issue: null
            };

        case IssueActions.UpdateIssueComplete:
            return {
                updating: false,
                errorOccurred: false,
                issue: action.payload.issue
            };
        default:
            return state;
    }
}
