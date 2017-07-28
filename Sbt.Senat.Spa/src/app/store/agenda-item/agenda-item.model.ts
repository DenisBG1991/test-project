import {IMeetingRef} from '@app/store/meeting/meeting-ref.model';
import {IIssueRef} from '@app/store/issue';
import {AgendaItemStatus} from '@app/store/agenda-item/agenda-item-status.model';

/**
 * Вопрос в контексте заседания.
 */
export interface IAgendaItem extends IAgendaItemRef {
    order: number;
    title: string;
    description: string;
    status: AgendaItemStatus;
}

export interface IAgendaItemRef {
    meeting: IMeetingRef;
    issue: IIssueRef;
}
