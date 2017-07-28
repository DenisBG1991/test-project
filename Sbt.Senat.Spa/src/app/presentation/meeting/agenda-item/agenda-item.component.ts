import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AgendaItemStatus} from '@app/store/agenda-item/agenda-item-status.model';
import {IAgendaItem} from '@app/store/agenda-item/agenda-item.model';
import {AgendaItemWorkflowAction} from '@app/store/agenda-item/agenda-item-workflow-action';
import {Router} from '@angular/router';
import {MeetingRef} from '@app/services/api/mapping.types';
import {StatusLabelColor} from '@app/presentation/ui-kit/status-label/status-label-style';

@Component({
    selector: 'senat-agenda-item',
    templateUrl: './agenda-item.component.html',
    styleUrls: ['./agenda-item.component.css']
})
export class AgendaItemComponent implements OnInit {

    agendaItemStatus = AgendaItemStatus;

    agendaItemWorkflowAction = AgendaItemWorkflowAction;

    @Input()
    agendaItem: IAgendaItem;

    @Input()
    meeting: MeetingRef;

    @Input()
    isTargetDragDrop = false;

    @Input()
    changeStateAllowed: boolean;

    @Input()
    removeAllowed: boolean;

    @Output()
    removed: EventEmitter<IAgendaItem> = new EventEmitter<IAgendaItem>();

    @Output()
    stateChanged: EventEmitter<AgendaItemWorkflowAction> = new EventEmitter<AgendaItemWorkflowAction>();


    constructor(private _router: Router) {
    }

    ngOnInit() {
    }

    /**
     * Возвращает перечень доступных действий в соответствии с workflow.
     * @returns {any}
     */
    getActions(status: AgendaItemStatus): Array<AgendaItemWorkflowAction> { // TODO: вынести в компонент, т.к. дублируется в повестке
        if (status === AgendaItemStatus.WaitingForConsideration
        ) {
            return [
                AgendaItemWorkflowAction.ToConsideration,
                AgendaItemWorkflowAction.ToVoting,
                AgendaItemWorkflowAction.ToRemoved
            ];
        }
        if (status === AgendaItemStatus.OnConsideration) {
            return [
                AgendaItemWorkflowAction.ToModification,
                AgendaItemWorkflowAction.ToVoting,
                AgendaItemWorkflowAction.ToFormalization,
                AgendaItemWorkflowAction.ToRemoved
            ];
        }
        if (status === AgendaItemStatus.OnModification) {
            return [AgendaItemWorkflowAction.ToConsideration];
        }
        if (status === AgendaItemStatus.OnVoting) {
            return [
                AgendaItemWorkflowAction.ToConsideration,
                AgendaItemWorkflowAction.ToFormalization
            ];
        }
        if (status === AgendaItemStatus.OnFormalization) {
            return [AgendaItemWorkflowAction.ToResolved];
        }

        return [];
    }

    getActionsWithoutToRewoved(status: AgendaItemStatus): Array<AgendaItemWorkflowAction> {
        return this.getActions(status).filter(action => action !== AgendaItemWorkflowAction.ToRemoved);
    }

    isSupportToRemoved(status: AgendaItemStatus) {
        return this.getActions(status).some(action => action === AgendaItemWorkflowAction.ToRemoved) && this.changeStateAllowed;
    }

    calculateColorLabelStatus(): StatusLabelColor {
        switch (this.agendaItem.status) {
            case AgendaItemStatus.WaitingForConsideration:
                return StatusLabelColor.Pink;
            case AgendaItemStatus.OnConsideration:
                return StatusLabelColor.Green;
            case AgendaItemStatus.OnVoting:
                return StatusLabelColor.Opaque;
            case AgendaItemStatus.OnFormalization:
                return StatusLabelColor.Grey;
            case AgendaItemStatus.OnModification:
                return StatusLabelColor.Orange;
            default:
                return StatusLabelColor.Grey;
        }
    }

    /**
     * Изменение статуса вопроса в повестке.
     */
    move(action: AgendaItemWorkflowAction, event: Event) {
        this.stateChanged.emit(action);
        // Without it, click event propagated to click event of parent container - card div and this cause
        // routing to AgendaItemPage
        event.stopPropagation();
    }
    
    clickRemoveButton(event: Event) {
        this.removed.emit(this.agendaItem);
        event.stopPropagation();
    }

    navigateToAgendaItem(item: IAgendaItem) {
        this._router.navigate([`/meetings/${this.meeting.id}/agenda/${item.issue.id}`]);
    }
}
