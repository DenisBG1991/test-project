import {IMaterial, IssueMaterialType} from '@app/store/material';
import {IIssueRef} from '@app/store/issue';
import {IMeetingRef} from '@app/store/meeting/meeting-ref.model';
import {IAgendaItemIdRef} from '@app/store/agenda-item/agenda-item.model';

/**
 * Материал вопроса.
 */
export interface IAgendaItemMaterial extends IMaterial {
    agendaItem: IAgendaItemIdRef;
    type: IssueMaterialType;
}
