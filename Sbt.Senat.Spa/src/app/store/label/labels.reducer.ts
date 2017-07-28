import {ILabel} from '@app/store/label';
import {LabelActions} from '@app/store/label/label.actions';

export function labelsReducer(state: Array<ILabel> = [], action) {
    switch (action.type) {
        case LabelActions.LoadLabelsCompleted:
            return action.payload.labels;

        default:
            return state;
    }
}
