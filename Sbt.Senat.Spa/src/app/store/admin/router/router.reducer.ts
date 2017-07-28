import {PersonActions} from '@app/store/admin/person/person.actions';

export function routerReducer(state: string = '', action) {
    switch (action.type) {

        case '@angular-redux/router::UPDATE_LOCATION':
            return action.payload || '';

            
        case PersonActions.CreatePersonComplete:
            return `admin/person/${action.payload.person.id}`;


        default:
            return state;
    }
}
