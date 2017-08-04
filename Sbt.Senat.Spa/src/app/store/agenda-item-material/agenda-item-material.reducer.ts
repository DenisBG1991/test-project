import {IAgendaItemMaterial} from '@app/store/agenda-item-material/agenda-item-material.model';
import {AgendaItemMaterialActions} from '@app/store/agenda-item-material/agenda-item-material.actions';
import {MaterialVersionActions} from '@app/store/material-version/material-version.actions';

export function agendaItemMaterialReducer(state: Array<IAgendaItemMaterial> = [], action) {
    switch (action.type) {

        case AgendaItemMaterialActions.LoadMaterialsComplete:
            return state.filter(m =>
                !action.payload.materials.some(mm => mm.agendaItem.id === m.agendaItem.id && mm.id === m.id))
                .concat(action.payload.materials);

        case AgendaItemMaterialActions.MaterialTypeChanged:

            const material = state.find(m => m.id === action.payload.material.id);
            material.type = action.payload.type;

            return state.filter(m => m.id !== action.payload.material.id)
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

        /*        case AgendaItemMaterialActions.LoadMaterialVersionsComplete:

         state.forEach(m => {
         const version = action.payload.versions.find(v => v.id === m.id);
         if (version && version.num > m.currentVersion.num) {
         m.currentVersion = {
         id: version.id,
         num: version.num
         };
         }
         });

         return state;*/

        case AgendaItemMaterialActions.DeleteMaterial:
            return state.filter(m => m.agendaItem.id !== action.payload.agendaItem.id ||
            m.id !== action.payload.material.id);

        default:
            return state;
    }
}
