import {Injectable} from '@angular/core';
import {IAgendaItem, IAgendaItemRef} from '@app/store/agenda-item/agenda-item.model';
import {AgendaItemWorkflowAction} from '@app/store/agenda-item/agenda-item-workflow-action';
import {IMeetingRef} from '@app/store/meeting/meeting-ref.model';

@Injectable()
export class AgendaItemActions {

    static readonly UpdateAgendaItems = 'UPDATE_AGENDA_ITEMS';
    static readonly LoadSingleAgendaItem = 'LOAD_SINGLE_AGENDA_ITEM';
    static readonly MoveAgendaItem = 'MOVE_AGENDA_ITEM';

    static readonly RemoveAgendaItem = 'REMOVE_AGENDA_ITEM';
    static readonly RemoveAgendaItemComplete = 'REMOVE_AGENDA_ITEM_COMPLETE';
    static readonly MoveAgendaItemState = 'MOVE_AGENDA_ITEM_STATE';

    static readonly CreateAgendaItems = 'CREATE_AGENDA_ITEMS';

    /**
     * Обновление вопросов повестки.
     * @param items
     * @returns {{type: string, payload: {items: Array<IAgendaItem>}}}
     */
    updateAgendaItems(items: Array<IAgendaItem>) {
        return {
            type: AgendaItemActions.UpdateAgendaItems,
            payload: {
                items: items
            }
        };
    }

    /**
     * Загрузка отдельного вопроса повестки.
     * @param agendaItem
     * @returns {{type: string, payload: {agendaItem: IAgendaItemRef}}}
     */
    loadAgendaItem(agendaItem: IAgendaItemRef) {
        return {
            type: AgendaItemActions.LoadSingleAgendaItem,
            payload: {
                agendaItem: agendaItem
            }
        };
    }

    /**
     * Перемещение вопроса в повестке на другую позицию.
     * @param item
     * @param newOrder
     * @returns {{type: string, payload: {agendaItem: IAgendaItem, order: number}}}
     */
    moveAgendaItem(item: IAgendaItem, newOrder: number) {
        return {
            type: AgendaItemActions.MoveAgendaItem,
            payload: {
                agendaItem: item,
                order: newOrder
            }
        };
    }

    removeAgendaItem(item: IAgendaItem) {
        return {
            type: AgendaItemActions.RemoveAgendaItem,
            payload: {
                agendaItem: item
            }
        };
    }

    removeAgendaItemComplete(item: IAgendaItem) {
        return {
            type: AgendaItemActions.RemoveAgendaItemComplete,
            payload: {
                agendaItem: item
            }
        };
    }

    moveAgendaItemState(item: IAgendaItemRef, action: AgendaItemWorkflowAction) {
        return {
            type: AgendaItemActions.MoveAgendaItemState,
            payload: {
                agendaItem: item,
                action: action
            }
        };
    }

    createAgendaItems(agendaItems: Array<IAgendaItemRef>, meeting: IMeetingRef) {
        return {
            type: AgendaItemActions.CreateAgendaItems,
            payload: {
                agendaItems: agendaItems,
                meeting: meeting
            }
        };
    }
}
