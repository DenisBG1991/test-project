import {Injectable} from '@angular/core';
import {IPerson, IPersonRef} from '@app/store/person/person.model';
import {IMultilingualPerson} from '@app/store/admin/person/person.model';
import {FormGroup} from '@angular/forms';

@Injectable()
export class PersonActions {


    static readonly CreatePerson = 'CREATE_PERSON';
    static readonly CreatePersonComplete = 'CREATE_PERSON_COMPLETE';
    static readonly CreatePersonFail = 'CREATE_PERSON_FAIL';

    static readonly LoadSinglePerson = 'LOAD_SINGLE_PERSON';
    static readonly LoadSinglePersonComplete = 'LOAD_SINGLE_PERSON_COMPLETE';
    static readonly LoadSinglePersonFail = 'LOAD_SINGLE_PERSON_FAIL';

    static readonly DeletePerson = 'DELETE_PERSON';
    static readonly DeletePersonComplete = 'DELETE_PERSON_COMPLETE';
    static readonly DeletePersonFail = 'DELETE_PERSON_FAIL';


    static readonly PersonFormChanged = '(FORM_CHANGE)PERSON';
    static readonly CreatePersonFormChanged = '(FORM_CHANGE)CREATE_PERSON';

    static readonly UpdatePerson = 'UPDATE_PERSON';
    static readonly UpdatePersonFail = 'UPDATE_PERSON_FAIL';

    createPerson(formGroup: FormGroup) {
        return {
            type: PersonActions.CreatePerson,
            payload: {
                formGroup: formGroup
            }
        };
    }

    createPersonComplete(person: IMultilingualPerson) {
        return {
            type: PersonActions.CreatePersonComplete,
            payload: {
                person: person
            }
        };
    }

    createPersonFail(error) {
        return {
            type: PersonActions.CreatePersonFail,
            payload: {
                error: error
            }
        };
    }

    loadSinglePerson(person: IPersonRef) {
        return {
            type: PersonActions.LoadSinglePerson,
            payload: {
                person: person
            }
        };
    }

    loadSinglePersonComplete(person: IMultilingualPerson) {
        return {
            type: PersonActions.LoadSinglePersonComplete,
            payload: {
                person: person
            }
        };
    }

    loadSinglePersonFail(error) {
        return {
            type: PersonActions.LoadSinglePersonFail,
            payload: {
                error: error
            }
        };
    }


    deletePerson(person: IPersonRef) {
        return {
            type: PersonActions.DeletePerson,
            payload: {
                person: person
            }
        };
    }

    deletePersonComplete(person: IPersonRef) {
        return {
            type: PersonActions.DeletePersonComplete,
            payload: {
                person: person
            }
        };
    }

    deletePersonFail(error) {
        return {
            type: PersonActions.DeletePersonFail,
            payload: {
                error: error
            }
        };
    }

    createPersonFormChanged(formGroup: FormGroup) {
        return {
            type: PersonActions.CreatePersonFormChanged,
            payload: {
                formGroup: formGroup
            }
        };
    }

    personFormChanged(formGroup: FormGroup) {
        return {
            type: PersonActions.PersonFormChanged,
            payload: {
                formGroup: formGroup
            }
        };
    }


    updatePerson(formGroup: FormGroup) {
        return {
            type: PersonActions.UpdatePerson,
            payload: {
                formGroup: formGroup
            }
        };
    }


    updatePersonFail(error) {
        return {
            type: PersonActions.UpdatePersonFail,
            payload: {
                error: error
            }
        };
    }
}
