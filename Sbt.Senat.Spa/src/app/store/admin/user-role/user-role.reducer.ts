import {IUserRole} from '@app/store/admin/user-role/user-role.model';
import {UserRoleActions} from '@app/store/admin/user-role/user-role.actions';
export function userRoleReducer(state: Array<IUserRole> = [], action): Array<IUserRole> {
    switch (action.type) {
        case UserRoleActions.CreateUserRoleComplete: {
            return state.concat(action.payload.userRole);
        }
        case UserRoleActions.LoadUserRolePageComplete: {
            return action.payload.page.pageNum === 1
                ? action.payload.page.items
                : state.concat(action.payload.page.items);
        }
        case UserRoleActions.DeleteUserRoleComplete: {
            return state.filter(f => f.id !== action.payload.userRole.id);
        }
        default:
            return state;
    }
}
