import {FormGroup} from '@angular/forms';
import {MeetingActions} from '@app/store/meeting/meeting.actions';

export function meetingAbsentiaFormReducer(state: FormGroup = null, action) {
    switch (action.type) {

        case MeetingActions.AbsentiaMeetingFormChanged:
            return action.payload.formGroup;

        default:
            return state;
    }
}
