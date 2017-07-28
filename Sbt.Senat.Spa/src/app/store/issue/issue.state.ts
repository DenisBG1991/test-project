import {IIssue} from '@app/store/issue/issue.types';
import {IOperationState} from '@app/store/store';
export  interface IIssueState extends IOperationState {
    issue: IIssue;
}

export const INITIAL_STATE: IIssueState = {
    issue: null,
    updating: false,
    errorOccurred: false
};
