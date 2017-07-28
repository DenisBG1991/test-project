import {Injectable} from '@angular/core';
import {IPermission, PermissionEnum} from '@app/store/permission';

@Injectable()
export class PermissionActions {
    static readonly LoadGroupPermissions = 'LOAD_ADMIN_GROUP_PERMISSIONS';
    static readonly LoadGroupPermissionsComplete = 'LOAD_ADMIN_GROUP_PERMISSIONS_COMPLETE';



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
}
