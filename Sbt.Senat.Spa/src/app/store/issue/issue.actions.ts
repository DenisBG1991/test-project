import {Injectable} from '@angular/core';
import {IIssue, IIssueRef} from '@app/store/issue';
import {ICollegialBodyRef} from '@app/store/collegial-body/collegial-body.model';
import {FormGroup} from '@angular/forms';


@Injectable()
export class IssueActions {

    static readonly ChangeIssueEditMode = 'CHANGE_ISSUE_EDIT_MODE';

    static readonly CreateIssue = 'CREATE_ISSUE';
    static readonly CreateIssueComplete = 'CREATE_ISSUE_COMPLETE';
    static readonly CreateIssueFail = 'CREATE_ISSUE_FAIL';

    static readonly UpdateIssue = 'UPDATE_ISSUE';
    static readonly UpdateIssueComplete = 'UPDATE_ISSUE_COMPLETE';
    static readonly UpdateIssueFail = 'UPDATE_ISSUE_FAIL';

    static readonly LoadIssue = 'LOAD_ISSUE';
    static readonly LoadIssueComplete = 'LOAD_ISSUE_COMPLETE';
    static readonly LoadIssueFail = 'LOAD_ISSUE_FAIL';

    static readonly DeleteIssue = 'DELETE_ISSUE';
    static readonly DeleteIssueComplete = 'DELETE_ISSUE_COMPLETE';
    static readonly DeleteIssueFail = 'DELETE_ISSUE_FAIL';

    static readonly MoveIssueState = 'MOVE_ISSUE_STATE';
    static readonly MoveIssueStateComplete = 'MOVE_ISSUE_STATE_COMPLETE';
    static readonly MoveIssueStateFail = 'MOVE_ISSUE_STATE_FAIL';

    static readonly FindIssues = 'FIND_ISSUES';
    static readonly FindIssuesComplete = 'FIND_ISSUES_COMPLETE';

    static readonly CreateIssueFormChanged = '(FORM_CHANGE)CREATE_ISSUE';


    changeIssueEditMode(editMode: boolean) {
        return {
            type: IssueActions.ChangeIssueEditMode,
            payload: {
                editMode: editMode
            }
        };
    }

    updateIssue(issue: IIssue) {
        return {
            type: IssueActions.UpdateIssue,
            payload: {
                issue: issue
            }
        };
    }

    updateIssueComplete(issue: IIssue) {
        return {
            type: IssueActions.UpdateIssueComplete,
            payload: {
                issue: issue
            }
        };
    }

    updateIssueFail(error) {
        return {
            type: IssueActions.UpdateIssueFail,
            payload: {
                error: error
            }
        };
    }

    deleteIssue(issue: IIssueRef) {
        return {
            type: IssueActions.DeleteIssue,
            payload: {
                issue: issue
            }
        };
    }

    deleteIssueComplete(issue: IIssueRef) {
        return {
            type: IssueActions.DeleteIssueComplete,
            payload: {
                issue: issue
            }
        };
    }

    deleteIssueFail(error) {
        return {
            type: IssueActions.DeleteIssueFail,
            payload: {
                error: error
            }
        };
    }

    loadIssue(ref: IIssueRef) {
        return {
            type: IssueActions.LoadIssue,
            payload: {
                issueRef: ref
            }
        };
    }

    loadIssueComplete(issue: IIssue) {
        return {
            type: IssueActions.LoadIssueComplete,
            payload: {
                issue: issue
            }
        };
    }

    loadIssueFail(error) {
        return {
            type: IssueActions.LoadIssueFail,
            payload: {
                error: error
            }
        };
    }


    moveIssueState(ref: IIssueRef, action: string) {
        return {
            type: IssueActions.MoveIssueState,
            payload: {
                issueRef: ref,
                action: action
            }
        };
    }

    moveIssueStateComplete(issue: IIssue) {
        return {
            type: IssueActions.MoveIssueStateComplete,
            payload: {
                issue: issue
            }
        };
    }

    moveIssueStateFail(error) {
        return {
            type: IssueActions.MoveIssueStateFail,
            payload: {
                error: error
            }
        };
    }

    createIssue(issue: IIssue) {
        return {
            type: IssueActions.CreateIssue,
            payload: {
                issue: issue
            }
        };
    }

    createIssueComplete(issue: IIssue) {
        return {
            type: IssueActions.CreateIssueComplete,
            payload: {
                issue: issue
            }
        };
    }

    createIssueFail(error) {
        return {
            type: IssueActions.CreateIssueFail,
            payload: {
                error: error
            }
        };
    }

    findIssues(collegialBody: ICollegialBodyRef, query: string) {
        return {
            type: IssueActions.FindIssues,
            payload: {
                collegialBody: collegialBody,
                query: query
            }
        };
    }

    findIssuesComplete(issues: Array<IIssue>) {
        return {
            type: IssueActions.FindIssuesComplete,
            payload: {
                issues: issues
            }
        };
    }

    createIssueFormChanged(formGroup: FormGroup) {
        return {
            type: IssueActions.CreateIssueFormChanged,
            payload: {
                formGroup: formGroup
            }
        };
    }
}
