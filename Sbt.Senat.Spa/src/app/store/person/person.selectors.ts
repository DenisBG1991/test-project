import {IPerson} from '@app/store/person/person.model';

export function findPersonsByQuery(persons: Array<IPerson>, query: string): Array<IPerson> {
    return persons
        .filter(p => (`${p.lastName} ${p.firstName} ${p.middleName}`.toLowerCase().indexOf(query.toLowerCase()) !== -1));
}
