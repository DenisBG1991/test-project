import {Injectable} from '@angular/core';

@Injectable()
export class PersonLayoutActions {
    static readonly ChangePersonLayoutEditMode = 'CHANGE_PERSON_LAYOUT_EDIT_MODE';

    changePersonLayoutEditMode(editMode: boolean) {
        return {
            type: PersonLayoutActions.ChangePersonLayoutEditMode,
            payload: {
                editMode: editMode
            }
        };
    }
}
