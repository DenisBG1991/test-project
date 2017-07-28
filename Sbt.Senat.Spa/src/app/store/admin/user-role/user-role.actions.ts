import {Injectable} from '@angular/core';
import {IUserRoleFilter} from '@app/store/admin/user-role/user-role-filter.model';
import {IPage, IPageInfo} from '@app/store/paging.model';
import {IUserRole, IUserRoleRef} from '@app/store/admin/user-role/user-role.model';
import {IRoleRef} from '@app/store/admin/role/role.model';
import {ICollegialBodyRef} from '@app/store/collegial-body/collegial-body.model';
import {IHoldingRef} from '@app/store/holding/holding.model';
import {ICompanyRef} from '@app/store/company/company.model';
@Injectable()
export class UserRoleActions {
    static readonly LoadUserRolePage = 'LOAD_USER_ROLE_PAGE';
    static readonly LoadUserRolePageComplete = 'LOAD_USER_ROLE_PAGE_COMPLETE';
    static readonly LoadUserRolePageFail = 'LOAD_USER_ROLE_PAGE_FAIL';


    static readonly CreateUserRole = 'CREATE_USER_ROLE';
    static readonly CreateUserRoleComplete = 'CREATE_USER_ROLE_COMPLETE';
    static readonly CreateUserRoleFail = 'CREATE_USER_ROLE_FAIL';


    static readonly DeleteUserRole = 'DELETE_USER_ROLE';
    static readonly DeleteUserRoleComplete = 'DELETE_USER_ROLE_COMPLETE';
    static readonly DeleteUserRoleFail = 'DELETE_USER_ROLE_FAIL';

    createUserRole(userRole: {
                       userId: string,
                       role: IRoleRef,
                       collegialBody: ICollegialBodyRef,
                       company: ICompanyRef,
                       holding: IHoldingRef
                   }) {
        return {
            type: UserRoleActions.CreateUserRole,
            payload: {
                userRole: userRole
            }
        };
    }
    createUserRoleComplete(userRole: IUserRole) {
        return {
            type: UserRoleActions.CreateUserRoleComplete,
            payload: {
                userRole: userRole
            }
        };
    }
    createUserRoleFail(error) {
        return {
            type: UserRoleActions.CreateUserRoleFail,
            payload: {
                error: error
            }
        };
    }

    loadUserRolePage(filter: IUserRoleFilter, pageToLoad: IPageInfo) {
        return {
            type: UserRoleActions.LoadUserRolePage,
            payload: {
                filter: filter,
                paging: pageToLoad
            }
        };
    }

    loadUserRolePageComplete(page: IPage<IUserRole>) {
        return {
            type: UserRoleActions.LoadUserRolePageComplete,
            payload: {
                page: page
            }
        };
    }
    loadUserRolePageFail(error) {
        return {
            type: UserRoleActions.LoadUserRolePageFail,
            payload: {
                error: error
            }
        };
    }


    deleteUserRole(userRole: IUserRoleRef) {
        return {
            type: UserRoleActions.DeleteUserRole,
            payload: {
                userRole: userRole
            }
        };
    }

    deleteUserRoleComplete(userRole: IUserRoleRef) {
        return {
            type: UserRoleActions.DeleteUserRoleComplete,
            payload: {
                userRole: userRole
            }
        };
    }
    deleteUserRoleFail(error) {
        return {
            type: UserRoleActions.DeleteUserRoleFail,
            payload: {
                error: error
            }
        };
    }
}
