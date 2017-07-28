import {IPerson} from '@app/store/person/person.model';
import {PersonActions} from '@app/store/person/person.actions';

export function personReducer(state: Array<IPerson> = [], action): Array<IPerson> {
    switch (action.type) {
        case PersonActions.LoadPersonsComplete:
            return state.filter(x => action.payload.persons.find(p => p.id === x.id) == null)
                .concat(action.payload.persons.reduce((prev, cur) => {
                    // убираем дубликаты из списка persons, если таковые есть
                    if (prev.find(x => x.id === cur.id) == null) {
                        return prev.concat(cur);
                    }
                    return prev;
                }, []));

        default:
            return state;
    }
}
