import {IUser} from '@app/store/user/user.model';
import {SessionActions} from '@app/store/session/session.actions';

export function sessionReducer(state: IUser = null, action): IUser {
    switch (action.type) {
        case SessionActions.LoginComplete:
            return action.payload.user;

        case SessionActions.LogoutComplete:
            return null;

        default:
            return state;
    }
}
