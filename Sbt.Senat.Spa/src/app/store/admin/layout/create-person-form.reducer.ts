import {FormGroup} from '@angular/forms';
import {PersonActions} from '@app/store/admin/person/person.actions';


export function createPersonFormReducer(state: FormGroup = null, action) {
    switch (action.type) {

        case PersonActions.CreatePersonFormChanged:
            return action.payload.formGroup;

        default:
            return state;
    }
}
