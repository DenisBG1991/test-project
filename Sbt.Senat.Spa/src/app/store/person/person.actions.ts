import {Injectable} from '@angular/core';
import {IPerson} from '@app/store/person/person.model';

@Injectable()
export class PersonActions {

    static readonly LoadPersons = 'LOAD_PERSONS';
    static readonly LoadPersonsComplete = 'LOAD_PERSONS_COMPLETE';
    static readonly LoadPersonsFail = 'LOAD_PERSONS_FAIL';


    loadPersons(query: string) {
        return {
            type: PersonActions.LoadPersons,
            payload: {
                query: query
            }
        };
    }

    loadPersonsComplete(persons: Array<IPerson>) {
        return {
            type: PersonActions.LoadPersonsComplete,
            payload: {
                persons: persons
            }
        };
    }

    loadPersonsFail(error) {
        return {
            type: PersonActions.LoadPersonsFail,
            payload: {
                error: error
            }
        };
    }
}
