import {IPermission} from '@app/store/admin/permission';
import {PermissionActions} from '@app/store/admin/permission/permission.actions';

export function permissionReducer(state: IPermission[] = [], action): IPermission[] {
    switch (action.type) {
        case PermissionActions.LoadGroupPermissionsComplete:
            return  action.payload.permissions;
        default:
            return state;
    }
}
