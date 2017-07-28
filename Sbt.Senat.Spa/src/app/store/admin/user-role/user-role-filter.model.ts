import {PermissionLevelEnum} from '@app/store/permission/permission.model';
export interface IUserRoleFilter {
    userId: string,
    permissionLevels: Array<PermissionLevelEnum>
}
