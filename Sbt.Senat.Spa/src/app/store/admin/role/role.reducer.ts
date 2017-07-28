import {RoleActions} from '@app/store/admin/role/role.actions';
import {IRole} from '@app/store/admin/role/role.model';
export function roleReducer(state: Array<IRole> = [], action): Array<IRole> {
    switch (action.type) {
        case RoleActions.Ping:
            return state.concat([]);
        case RoleActions.UpdateRolesComplete:
            return state.filter(x => !action.payload.roles.some(r => r.id === x.id))
                .concat(action.payload.roles);
        default:
            return state;
    }
}
