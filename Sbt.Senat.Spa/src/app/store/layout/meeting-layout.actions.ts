import {Injectable} from '@angular/core';

@Injectable()
export class MeetingLayoutActions {
    static readonly ChangeMeetingLayoutEditMode = 'CHANGE_MEETING_LAYOUT_EDIT_MODE';

    changeMeetingLayoutEditMode(editMode: boolean) {
        return {
            type: MeetingLayoutActions.ChangeMeetingLayoutEditMode,
            payload: {
                editMode: editMode
            }
        };
    }
}
