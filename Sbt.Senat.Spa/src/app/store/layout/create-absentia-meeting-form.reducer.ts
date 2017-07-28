import {FormGroup} from '@angular/forms';
import {MeetingActions} from '@app/store/meeting/meeting.actions';

export function createAbsentiaMeetingFormReducer(state: FormGroup = null, action) {
    switch (action.type) {

        case MeetingActions.CreateAbsentiaFormChanged:
            return action.payload.formGroup;

        default:
            return state;
    }
}
