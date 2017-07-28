import {IPermission} from '@app/store/permission';
import {PermissionActions} from '@app/store/permission/permission.actions';
import {PermissionLevelEnum} from '@app/store/permission/permission.model';

export function permissionReducer(state: IPermission[] = [], action): IPermission[] {
    switch (action.type) {
        case PermissionActions.LoadGroupPermissionsComplete:
            return state.filter(s => s.issue || s.meeting)
                .concat(action.payload.permissions);
        case PermissionActions.AddIssuePermissionsComplete:
            return state.filter(s => !s.issue || s.issue.id !== action.payload.issue.id)
                .concat(action.payload.permissionEnums.map(m => {
                    return {
                        holding: null,
                        company: null,
                        collegialBody: null,
                        meeting: null,
                        issue: action.payload.issue,
                        permission: m,
                        permissionLevel: PermissionLevelEnum.Issue
                    }
                }));
        case PermissionActions.AddMeetingPermissionsComplete:
            return state.filter(s => !s.meeting || s.meeting.id !== action.payload.meeting.id)
                .concat(action.payload.permissionEnums.map(m => {
                    return {
                        holding: null,
                        company: null,
                        collegialBody: null,
                        meeting: action.payload.meeting,
                        issue: null,
                        permission: m,
                        permissionLevel: PermissionLevelEnum.Meeting
                    }
                }));
        default:
            return state;
    }
}
