import {IMaterialVersion} from '@app/store/material-version/material-version.model';
import {MaterialVersionActions} from '@app/store/material-version/material-version.actions';

export function materialVersionReducer(state: Array<IMaterialVersion> = [], action) {
    switch (action.type) {

        case MaterialVersionActions.LoadMaterialVersionsComplete:
            return state.filter(v => action.payload.versions.find(vv => vv.id === v.id && vv.num === v.num) == null)
                .concat(action.payload.versions);

        default:
            return state;
    }
}
