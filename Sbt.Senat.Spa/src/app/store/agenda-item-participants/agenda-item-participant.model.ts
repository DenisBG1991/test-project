import {AgendaItemParticipantRole} from '@app/store/agenda-item-participants/agenda-item-participant-role.model';
import {IPersonRef} from '@app/store/person/person.model';
import {IAgendaItemRef} from '@app/store/agenda-item/agenda-item.model';

/**
 * Участник вопроса в повестке заседания.
 */
export interface IAgendaItemParticipant extends IParticipant {
    agendaItem: IAgendaItemRef;
    roles: Array<AgendaItemParticipantRole>;
}
export interface IParticipant {
    person: IPersonRef;
    presents: boolean;
}
