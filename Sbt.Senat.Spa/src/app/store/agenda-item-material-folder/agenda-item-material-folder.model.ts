import {IIssueRef} from '@app/store/issue';
import {IMaterialFolder} from '@app/store/material/material-folder.model';
import {IMeetingRef} from '@app/store/meeting/meeting-ref.model';
import {IAgendaItemIdRef} from '@app/store/agenda-item/agenda-item.model';

export interface IAgendaItemMaterialFolder extends IMaterialFolder {
    agendaItem: IAgendaItemIdRef;
}
