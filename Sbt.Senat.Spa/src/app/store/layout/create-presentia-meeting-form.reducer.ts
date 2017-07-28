import {FormGroup} from '@angular/forms';
import {MeetingActions} from '@app/store/meeting/meeting.actions';

export function createPresentiaMeetingFormReducer(state: FormGroup = null, action) {
    switch (action.type) {

        case MeetingActions.CreatePresentiaFormChanged:
            return action.payload.formGroup;

        default:
            return state;
    }
}
