import {IRole} from '@app/store/admin/role/role.model';
export interface IUserRoleObject {
    id: string,
    name: string
}
export interface IUserRole extends IUserRoleRef {
    holding: IUserRoleObject,
    company: IUserRoleObject,
    collegialBody: IUserRoleObject,
    role: IRole,
    userId: string
}
export interface IUserRoleRef {
    id: string
}
