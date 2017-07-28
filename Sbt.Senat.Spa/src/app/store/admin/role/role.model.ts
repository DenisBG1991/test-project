import {PermissionLevelEnum} from '@app/store/permission/permission.model';
export interface IRoleRef {
    id: string
}
export interface IRole extends IRoleRef {
    name: string,
    permissionLevel: PermissionLevelEnum
}
