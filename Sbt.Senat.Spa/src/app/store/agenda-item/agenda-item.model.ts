import {IMeetingRef} from '@app/store/meeting/meeting-ref.model';
import {IIssueRef} from '@app/store/issue';
import {AgendaItemStatus} from '@app/store/agenda-item/agenda-item-status.model';
import {IDecisionApproval} from '@app/store/decision/decision.model';

/**
 * Вопрос в контексте заседания.
 */
export interface IAgendaItem extends IAgendaItemRef, IAgendaItemIdRef {
    order: number;
    title: string;
    description: string;
    status: AgendaItemStatus;
    approval: IDecisionApproval;
}

export interface IAgendaItemRef {
    meeting: IMeetingRef;
    issue: IIssueRef;
}

export interface IAgendaItemIdRef {
    id: string;
}
