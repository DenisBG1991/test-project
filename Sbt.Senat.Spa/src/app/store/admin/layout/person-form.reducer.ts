import {FormGroup} from '@angular/forms';
import {PersonActions} from '@app/store/admin/person/person.actions';


export function personFormReducer(state: FormGroup = null, action) {
    switch (action.type) {

        case PersonActions.PersonFormChanged:
            return action.payload.formGroup;

        default:
            return state;
    }
}
