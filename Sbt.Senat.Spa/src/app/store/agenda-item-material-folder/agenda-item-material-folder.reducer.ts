
import {IAgendaItemMaterialFolder} from '@app/store/agenda-item-material-folder/agenda-item-material-folder.model';
import {AgendaItemMaterialFolderActions} from '@app/store/agenda-item-material-folder/agenda-item-material-folder.actions';

export function agendaItemMaterialFolderReducer(state: Array<IAgendaItemMaterialFolder> = [], action) {
    switch (action.type) {
        case AgendaItemMaterialFolderActions.LoadFoldersComplete:
            return state.filter(f => action.payload.folders
                .find(ff => ff.agendaItem.id === f.agendaItem.id && ff.location === f.location) == null)
                .concat(action.payload.folders);

        default:
            return state;
    }
}
