import {IMeetingRef} from '@app/store/meeting/meeting-ref.model';
import {IAgendaItemMaterialFolder} from '@app/store/agenda-item-material-folder/agenda-item-material-folder.model';
import {IIssueRef} from '@app/store/issue';
import {Injectable} from '@angular/core';
import {IAgendaItemIdRef} from '@app/store/agenda-item/agenda-item.model';

@Injectable()
export class AgendaItemMaterialFolderActions {
    static readonly LoadFolder = 'LOAD_AGENDA_ITEM_MATERIALS_FOLDER';
    static readonly LoadFoldersComplete = 'LOAD_AGENDA_ITEM_MATERIAL_FOLDERS_COMPLETE';

    loadFolder(agendaItem: IAgendaItemIdRef, location: string) {
        return {
            type: AgendaItemMaterialFolderActions.LoadFolder,
            payload: {
                agendaItem: agendaItem,
                location: location
            }
        };
    }

    loadFoldersComplete(folders: Array<IAgendaItemMaterialFolder>) {
        return {
            type: AgendaItemMaterialFolderActions.LoadFoldersComplete,
            payload: {
                folders: folders
            }
        };
    }
}
