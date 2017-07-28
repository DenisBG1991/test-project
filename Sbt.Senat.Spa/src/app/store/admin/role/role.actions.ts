import {Injectable} from '@angular/core';
import {IRole} from '@app/store/admin/role/role.model';
@Injectable()
export class RoleActions {
    static readonly Ping = 'ROLES_PING';
    static readonly UpdateRoles = 'UPDATE_ROLES';
    static readonly UpdateRolesComplete = 'UPDATE_ROLES_COMPLETE';
    static readonly UpdateRolesFail = 'UPDATE_ROLES_FAIL';

    ping() {
        return {
            type: RoleActions.Ping
        };
    }

    updateRoles() {
        return {
            type: RoleActions.UpdateRoles
        };
    }

    updateRolesComplete(roles: Array<IRole>) {
        return {
            type: RoleActions.UpdateRolesComplete,
            payload: {
                roles: roles
            }
        };
    }

    updateRolesFail(error) {
        return {
            type: RoleActions.UpdateRolesFail,
            payload: {
                error: error
            }
        };
    }
}
