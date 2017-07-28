
import {IMultilingualPerson} from '@app/store/admin/person/person.model';
import {PersonActions} from '@app/store/admin/person/person.actions';

export function personReducer(state: Array<IMultilingualPerson> = [], action): Array<IMultilingualPerson> {
    switch (action.type) {
        case PersonActions.LoadSinglePersonComplete:
        case PersonActions.CreatePersonComplete:
            return state.filter(x => action.payload.person.id !== x.id)
                .concat(action.payload.person);
        default:
            return state;
    }
}
