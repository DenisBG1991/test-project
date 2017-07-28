import {IIssueMaterial} from '@app/store/issue-material/issue-material.model';
import {IssueMaterialActions} from '@app/store/issue-material/issue-material.actions';
import {MaterialVersionActions} from '@app/store/material-version/material-version.actions';

export function issueMaterialReducer(state: Array<IIssueMaterial> = [], action) {
    switch (action.type) {

        case IssueMaterialActions.LoadMaterialsComplete:
            return state.filter(m => action.payload.materials.find(mm => mm.issue.id === m.issue.id && mm.id === m.id) == null)
                .concat(action.payload.materials);

        case IssueMaterialActions.MaterialTypeChanged:

            const material = state.find(m => m.issue.id === action.payload.issue.id && m.id === action.payload.material.id);
            material.type = action.payload.type;

            return state.filter(m => m.issue.id !== action.payload.issue.id || m.id !== action.payload.material.id)
                .concat(material);

        case MaterialVersionActions.LoadMaterialVersionsComplete:

            state.forEach(m => {
                const version = action.payload.versions.find(v => v.id === m.id);
                if (version && version.num > m.currentVersion.num) {
                    m.currentVersion = {
                        id: version.id,
                        num: version.num
                    };
                }
            });

            return state;

        case IssueMaterialActions.DeleteMaterial:
            return state.filter(m => m.issue.id !== action.payload.material.issue.id || m.id !== action.payload.material.id);

        default:
            return state;
    }
}
