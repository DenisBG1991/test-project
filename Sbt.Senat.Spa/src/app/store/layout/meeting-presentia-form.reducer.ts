import {FormGroup} from '@angular/forms';
import {MeetingActions} from '@app/store/meeting/meeting.actions';

export function meetingPresentiaFormReducer(state: FormGroup = null, action) {
    switch (action.type) {

        case MeetingActions.PresentiaMeetingFormChanged:
            return action.payload.formGroup;

        default:
            return state;
    }
}
