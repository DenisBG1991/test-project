import {IAgendaItemParticipant} from '@app/store/agenda-item-participants/agenda-item-participant.model';
import {AgendaItemParticipantActions} from '@app/store/agenda-item-participants/agenda-item-participant.actions';

export function agendaItemParticipantsReducer(state: Array<IAgendaItemParticipant> = [], action): Array<IAgendaItemParticipant> {

    switch (action.type) {

        case AgendaItemParticipantActions.UpdateAgendaItemParticipants:

            // поиск соответствия полученных participants и meetingParticipant для заполнения alternates
            // могут передаваться и все участники и отдельно только заместители или только руководители
/*            if (action.payload.meetingParticipant) {
                action.payload.participants.forEach(v => {
                    // !!! обновление store идет по meeting-id + issue-id + person-id, поэтому восстанавливаем заместителей
                    const mainPerson = action.payload.meetingParticipant.find(mp => mp.alternates.some(al => al.id === v.person.id));
                    if (mainPerson) {
                        // поиск руководителя в payload
                        let mainAttendee = action.payload.participants.find(p => p.person.id === mainPerson.person.id);
                        if (!mainAttendee) {
                            // поиск руководителя в store
                            mainAttendee = state.find(p => p.person.id === mainPerson.person.id);
                            action.payload.participants.push(mainAttendee);
                        }
                        mainAttendee.alternates = mainAttendee.alternates || [];
                        mainAttendee.alternates = mainAttendee.alternates.filter(f => f.person.id !== v.person.id)
                            .concat({
                                person: v.person,
                                presents: v.presents
                            });
                    } else {
                        // поиск руководителя в store
                        const mainAttendee = state.find(p => p.person.id === v.person.id);
                        if (mainAttendee) {
                            // и восстанавливаем его заместителей, т.к. их нет в payload
                            v.alternates = mainAttendee.alternates;
                        }
                    }
                })
            }*/

            // необходимо обновить (заменить на новые значения) участников
            // ключ: meeting-id + issue-id + person-id
            return state.filter(x => !action.payload.participants
                .some(p => p.agendaItem.meeting.id === x.agendaItem.meeting.id &&
                p.agendaItem.issue.id === x.agendaItem.issue.id &&
                p.person.id === x.person.id))
                .concat(action.payload.participants);

            // участники, которые являются замами удаляются из основной коллекции

/*            return ret.filter(f =>
                !ret.some(s => s.alternates && s.alternates.some(a => a.person.id === f.person.id)));*/


        case AgendaItemParticipantActions.RemoveAgendaItemParticipantRole:
            const participant = state.find(x => x.agendaItem.meeting.id === action.payload.participant.agendaItem.meeting.id &&
            x.agendaItem.issue.id === action.payload.participant.agendaItem.issue.id &&
            x.person.id === action.payload.participant.person.id);

            participant.roles = participant.roles.filter(x => x !== action.payload.role);

            if (participant.roles.length === 0) {
                return state.filter(x => x.agendaItem.meeting.id !== action.payload.participant.agendaItem.meeting.id ||
                x.agendaItem.issue.id !== action.payload.participant.agendaItem.issue.id ||
                x.person.id !== action.payload.participant.person.id);
            } else {
                return state.filter(x => x.agendaItem.meeting.id !== action.payload.participant.agendaItem.meeting.id ||
                x.agendaItem.issue.id !== action.payload.participant.agendaItem.issue.id ||
                x.person.id !== action.payload.participant.person.id)
                    .concat(participant);
            }

        default:
            return state;
    }
}
