import {Injectable} from '@angular/core';
import {IAgendaItemParticipant} from '@app/store/agenda-item-participants/agenda-item-participant.model';
import {AgendaItemParticipantRole} from '@app/store/agenda-item-participants/agenda-item-participant-role.model';
import {IPerson} from '@app/store/person/person.model';
import {IAgendaItem, IAgendaItemIdRef, IAgendaItemRef} from '@app/store/agenda-item/agenda-item.model';
import {IMeetingParticipant} from '@app/store/meeting-participant/meeting-participant.model';

@Injectable()
export class AgendaItemParticipantActions {

    static readonly UpdateAgendaItemParticipants = 'UPDATE_AGENDA_ITEM_PARTICIPANTS';
    static readonly CheckInAgendaItemParticipant = 'CHECK_IN_AGENDA_ITEM_PARTICIPANT';
    static readonly CheckOutAgendaItemParticipant = 'CHECK_OUT_AGENDA_ITEM_PARTICIPANT';
    static readonly AddAgendaItemParticipantRole = 'ADD_AGENDA_ITEM_PARTICIPANT_ROLE';
    static readonly RemoveAgendaItemParticipantRole = 'REMOVE_AGENDA_ITEM_PARTICIPANT_ROLE';
    static readonly SyncParticipantAgendaPresent = 'SYNC_PARTICIPANT_AGENDA_PRESENT';

    /**
     * Обновление участников вопроса повестки.
     * @param participants
     * @returns {{type: string, payload: {participants: Array<IAgendaItemParticipant>}}}
     */
    updateAgendaItemParticipants(participants: Array<IAgendaItemParticipant>, meetingParticipant: Array<IMeetingParticipant>) {
        return {
            type: AgendaItemParticipantActions.UpdateAgendaItemParticipants,
            payload: {
                participants: participants,
                meetingParticipant: meetingParticipant
            }
        };
    }

    /**
     * Отметка о присутствии участника.
     * @param participant
     * @returns {{type: string, payload: {participant: IAgendaItemParticipant}}}
     */
    checkInParticipant(participant: IAgendaItemParticipant) {
        return {
            type: AgendaItemParticipantActions.CheckInAgendaItemParticipant,
            payload: {
                participant: participant
            }
        };
    }

    /**
     * Отметка об отсутствии участника.
     * @param participant
     * @returns {{type: string, payload: {participant: IAgendaItemParticipant}}}
     */
    checkOutParticipant(participant: IAgendaItemParticipant) {
        return {
            type: AgendaItemParticipantActions.CheckOutAgendaItemParticipant,
            payload: {
                participant: participant
            }
        };
    }

    addParticipantRole(agendaItem: IAgendaItemRef, agendaItemId: IAgendaItemIdRef, person: IPerson, role: AgendaItemParticipantRole) {
        return {
            type: AgendaItemParticipantActions.AddAgendaItemParticipantRole,
            payload: {
                agendaItem: agendaItem,
                agendaItemId: agendaItemId,
                person: person,
                role: role
            }
        };
    }

    removeParticipantRole(participant: IAgendaItemParticipant, role: AgendaItemParticipantRole) {
        return {
            type: AgendaItemParticipantActions.RemoveAgendaItemParticipantRole,
            payload: {
                participant: participant,
                role: role
            }
        };
    }

    syncParticipantAgendaPresent(participant: IAgendaItemParticipant, agendaItems: Array<IAgendaItem>) {
        return {
            type: AgendaItemParticipantActions.SyncParticipantAgendaPresent,
            payload: {
                participant: participant,
                agendaItems: agendaItems
            }
        };
    }
}
