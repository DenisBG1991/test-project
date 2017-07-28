import {IPersonUser} from '@app/store/admin/user/user.model';
import {UserActions} from '@app/store/admin/user/user.actions';
export function userReducer(state: Array<IPersonUser> = [], action): Array<IPersonUser> {
    switch (action.type) {
        case UserActions.LoadUserComplete:
            return state.filter(x => action.payload.user.id !== x.id)
                .concat(action.payload.user);
        default:
            return state;
    }
}


