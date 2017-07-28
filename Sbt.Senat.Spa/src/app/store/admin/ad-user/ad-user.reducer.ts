import { IAdUser, IAdUserDetailed } from '@app/store/admin/ad-user/ad-user.model';
import { AdUserActions } from '@app/store/admin/ad-user/ad-user.actions';
import { UserActions } from '@app/store/admin/user/user.actions';

export function adUsersReducer(state: Array<IAdUser> = [], action): Array<IAdUser> {
    switch (action.type) {
        case AdUserActions.AdUsersPing:
            return state.concat([]);
        case AdUserActions.LoadAdUsersComplete:
            return state.filter(x => !!x && !action.payload.adUsers.some(u => !!u && !!x && u.adLogin === x.adLogin))
                .concat(action.payload.adUsers);
        default:
            return state;
    }
}

export function adUsersDetailedReducer(state: Array<IAdUserDetailed> = [], action): Array<IAdUserDetailed> {
    switch (action.type) {
        case AdUserActions.LoadAdUserDetailedComplete:
            return state.filter(x => action.payload.adUser.adLogin !== x.adLogin)
                .concat(action.payload.adUser);
        case UserActions.LoadUserComplete:
            const ret = state;
            const updated = ret.find(f => f.adLogin === action.payload.user.authMethods['ad']);
            if (updated) {
                updated.userPerson = action.payload.user;
                return ret;
            }
            return state;
        default:
            return state;
    }
}


