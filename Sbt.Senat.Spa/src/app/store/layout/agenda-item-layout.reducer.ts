import {agendaItemLayoutInitialState, IAgendaItemLayoutState} from '@app/store/layout/agenda-item-layout-state.model';
import {AgendaItemLayoutActions} from '@app/store/layout/agenda-item-layout.actions';
import {IAgendaItemParticipant} from '@app/store/agenda-item-participants/agenda-item-participant.model';

interface IAgendaItemLayoutReducerActionType {
    type: string;
    payload: { participants: Array<IAgendaItemParticipant> } & { attendees: Array<IAgendaItemParticipant> };
}

export function agendaItemLayoutReducer(state: IAgendaItemLayoutState = agendaItemLayoutInitialState,
                                        action: IAgendaItemLayoutReducerActionType): IAgendaItemLayoutState {
    switch (action.type) {
        case AgendaItemLayoutActions.ChangeCheckInAttendeeState: {

            const newState = action.payload.participants.map(x => {
                const prevState = state.attendees.find(a => a.person.id === x.person.id);

                return {
                    person: x.person,
                    presents: x.presents,
                    prevPresents: prevState ? prevState.presents : false
                };
            });

            const remainderAttendees = state.attendees.filter(x => action.payload.participants
                .find(p => p.person.id === x.person.id) == null)
                .map(x => {
                    return {
                        person: x.person,
                        presents: x.presents,
                        prevPresents: x.presents
                    };
                });

            return {
                attendees: remainderAttendees.concat(newState)
            };
        }

        case AgendaItemLayoutActions.LoadAttendeesAgendaItemLayoutState: {
            const attendees = action.payload.attendees.map(x => {
                return {
                    person: x.person,
                    presents: x.presents,
                    prevPresents: x.presents
                };
            });
            return {
                attendees: attendees
            };
        }

        default:
            return state;
    }
}
