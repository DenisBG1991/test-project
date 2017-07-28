import {FormGroup} from '@angular/forms';
import {IssueActions} from '@app/store/issue';
import {LabelActions} from '@app/store/label/label.actions';

export function createIssueFormReducer(state: FormGroup = null, action) {
    switch (action.type) {

        case IssueActions.CreateIssueFormChanged:
            return action.payload.formGroup;

        default:
            return state;
    }
}
