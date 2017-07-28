import {IIssue, IssueActions} from '@app/store/issue';

export function issuesReducer(state: Array<IIssue> = [], action) {
    switch (action.type) {
        case IssueActions.FindIssuesComplete:
            return action.payload.issues;

        default:
            return state;
    }
}
