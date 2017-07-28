import {IAgendaItemParticipant} from '@app/store/agenda-item-participants/agenda-item-participant.model';
export class AgendaItemLayoutActions {

    static readonly ChangeCheckInAttendeeState = 'CHANGE_CHECK_IN_ATTENDEE_STATE';
    static readonly LoadAttendeesAgendaItemLayoutState = 'LOAD_ATTENDEES_AGENDA_ITEM_LAYOUT_STATE';

    changeCheckInAttendeeState(participants: Array<IAgendaItemParticipant>) {
        return {
            type: AgendaItemLayoutActions.ChangeCheckInAttendeeState,
            payload: {
                participants: participants
            }
        };
    }

    loadAttendeesAgendaItemLayoutState(participants: Array<IAgendaItemParticipant>) {
        return {
            type: AgendaItemLayoutActions.LoadAttendeesAgendaItemLayoutState,
            payload: {
                attendees: participants
            }
        };
    }
}
