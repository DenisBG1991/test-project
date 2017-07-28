import {IAgendaItem} from '@app/store/agenda-item/agenda-item.model';
import {AgendaItemActions} from '@app/store/agenda-item/agenda-item.actions';

export function agendaItemReducer(state: Array<IAgendaItem> = [], action): Array<IAgendaItem> {
    switch (action.type) {
        case AgendaItemActions.UpdateAgendaItems:
            return state.filter(x => action.payload.items.find(i => i.issue.id === x.issue.id && i.meeting.id === x.meeting.id) == null)
                .concat(action.payload.items);

        case AgendaItemActions.RemoveAgendaItemComplete:
            // декремент номеров вопросов, стоящих после удалённого, в повестке того же заседания
            state.forEach(item => {
                if (item.meeting.id === action.payload.agendaItem.meeting.id &&
                    item.order > action.payload.agendaItem.order) {
                    item.order = item.order - 1;
                }
            });

            // возвращаем все agendaItem'ы, за исключением удалённого
            return state.filter(x =>
            x.meeting.id !== action.payload.agendaItem.meeting.id ||
            x.issue.id !== action.payload.agendaItem.issue.id);

        default:
            return state;
    }
}
