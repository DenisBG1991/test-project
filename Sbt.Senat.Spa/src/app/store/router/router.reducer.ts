import {MeetingActions} from '@app/store/meeting/meeting.actions';
import {SessionActions} from '@app/store/session/session.actions';
import {IssueActions} from '@app/store/issue';

export function routerReducer(state: string = '', action) {
    switch (action.type) {

        case '@angular-redux/router::UPDATE_LOCATION':
            return action.payload || '';

        case SessionActions.LoginComplete:
            return `meetings`;

        case SessionActions.LogoutComplete:
            return `login`;

        case IssueActions.CreateIssueComplete:
            return `issues/${action.payload.issue.id}`;

        case IssueActions.DeleteIssueComplete:
            return `issues`;

        case MeetingActions.CreatePresentiaMeetingComplete:
            return `meetings/${action.payload.meeting.id}`;

        case MeetingActions.CreateAbsentiaMeetingComplete:
            return `meetings/${action.payload.meeting.id}`;

        case MeetingActions.DeleteMeetingComplete:
            return `meetings`;
        default:
            return state;
    }
}
