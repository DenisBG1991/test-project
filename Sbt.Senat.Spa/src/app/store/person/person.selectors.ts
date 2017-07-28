import {IPerson} from '@app/store/person/person.model';
import {IAppState} from '@app/store/store';

export function findPersonsByQuery(state: IAppState, query: string): Array<IPerson> {
    return state.persons
        .filter(p => (`${p.lastName} ${p.firstName} ${p.middleName}`.toLowerCase().indexOf(query.toLowerCase()) !== -1));
}
