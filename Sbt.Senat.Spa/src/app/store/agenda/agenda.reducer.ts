import {IAgenda} from '@app/store/agenda/agenda.model';
import {AgendaActions} from '@app/store/agenda/agenda.actions';

export function agendaReducer(state: Array<IAgenda> = [], action): Array<IAgenda> {
    switch (action.type) {

        case AgendaActions.UpdateAgenda:
            // обновляем повестку заседания (заменяем на новую, пришедшую в экшене)
            return state.filter(x => x.meeting.id !== action.payload.agenda.meeting.id)
                .concat(action.payload.agenda);

        default:
            return state;
    }
}
