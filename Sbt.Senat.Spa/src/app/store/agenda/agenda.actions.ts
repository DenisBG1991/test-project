import {Injectable} from '@angular/core';
import {IAgenda} from '@app/store/agenda/agenda.model';
import {IMeetingRef} from '@app/store/meeting/meeting-ref.model';

@Injectable()
export class AgendaActions {

    static readonly GetAgenda = 'AGENDA_GET';
    static readonly UpdateAgenda = 'AGENDA_UPDATE';

    /**
     * Запрос повестки заседания.
     * @param meeting
     * @returns {{type: string, payload: {meeting: IMeetingRef}}}
     */
    getAgenda(meeting: IMeetingRef) { // TODO: static'и?
        return {
            type: AgendaActions.GetAgenda,
            payload: {
                meeting: meeting
            }
        };
    }

    /**
     * Обновление повестки заседания.
     * @param agenda
     * @returns {{type: string, payload: {agenda: IAgenda}}}
     */
    updateAgenda(agenda: IAgenda) {
        return {
            type: AgendaActions.UpdateAgenda,
            payload: {
                agenda: agenda
            }
        };
    }
}
