import {IPersonLayoutState, personLayoutInitialState} from '@app/store/admin/layout/person-layout-state.model';
import {PersonLayoutActions} from '@app/store/admin/layout/person-layout.actions';
import {PersonActions} from '@app/store/admin/person/person.actions';

export function personLayoutReducer(state: IPersonLayoutState = personLayoutInitialState, action): IPersonLayoutState {
    switch (action.type) {
        case PersonActions.LoadSinglePersonComplete:
            return {
                editMode: false
            };
        case PersonLayoutActions.ChangePersonLayoutEditMode:
            return {
                editMode: action.payload.editMode
            };
        default:
            return state;
    }
}
