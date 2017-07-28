import {Injectable} from '@angular/core';
import {IPermission, PermissionEnum} from '@app/store/permission';
import {IIssueRef} from '@app/store/issue';
import {IMeetingRef} from '@app/store/meeting/meeting-ref.model';
@Injectable()
export class PermissionActions {
    static readonly LoadGroupPermissions = 'LOAD_GROUP_PERMISSIONS';
    static readonly LoadGroupPermissionsComplete = 'LOAD_GROUP_PERMISSIONS_COMPLETE';

    static readonly AddIssuePermissions = 'ADD_ISSUE_PERMISSIONS';
    static readonly AddIssuePermissionsComplete = 'ADD_ISSUE_PERMISSIONS_COMPLETE';

    static readonly AddMeetingPermissions = 'ADD_MEETING_PERMISSIONS';
    static readonly AddMeetingPermissionsComplete = 'ADD_MEETING_PERMISSIONS_COMPLETE';

    loadGroupPermissions() {
        return {
            type: PermissionActions.LoadGroupPermissions,
            payload: {
            }
        };
    }

    loadGroupPermissionsComplete(permissions: IPermission[]) {
        return {
            type: PermissionActions.LoadGroupPermissionsComplete,
            payload: {
                permissions: permissions
            }
        };
    }



    addIssuePermissions(issue: IIssueRef) {
        return {
            type: PermissionActions.AddIssuePermissions,
            payload: {
                issue: issue
            }
        };
    }

    addIssuePermissionsComplete(issue: IIssueRef, permissionEnums: PermissionEnum[]) {
        return {
            type: PermissionActions.AddIssuePermissionsComplete,
            payload: {
                permissionEnums: permissionEnums,
                issue: issue
            }
        };
    }

    addMeetingPermissions(meeting: IMeetingRef) {
        return {
            type: PermissionActions.AddMeetingPermissions,
            payload: {
                meeting: meeting
            }
        };
    }

    addMeetingPermissionsComplete(meeting: IMeetingRef, permissionEnums: PermissionEnum[]) {
        return {
            type: PermissionActions.AddMeetingPermissionsComplete,
            payload: {
                permissionEnums: permissionEnums,
                meeting: meeting
            }
        };
    }

}
