import {RouterHistoryActions} from '@app/store/router/router-history.actions';

export function routerHistoryReducer(state: Array<string> = [], action) {
    switch (action.type) {
        case RouterHistoryActions.NavigationCompleted: {
            if (state.length === 10) {
                const [, ...remainder] = state;
                return [...remainder, action.payload.url];
            } else {
                return [...state, action.payload.url];
            }
        }

        default:
            return state;
    }
}
