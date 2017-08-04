import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {AgendaItemStatus} from '@app/store/agenda-item/agenda-item-status.model';
import {IAgendaItem} from '@app/store/agenda-item/agenda-item.model';
import {AgendaItemWorkflowAction} from '@app/store/agenda-item/agenda-item-workflow-action';
import {Router} from '@angular/router';
import {MeetingRef} from '@app/services/api/mapping.types';
import {StatusLabelColor} from '@app/presentation/ui-kit/status-label/status-label-style';
import {MeetingStatus} from '@app/store/meeting/meeting-status';
import {IDecision} from '@app/store/decision/decision.model';
import {ButtonType} from '@app/presentation/ui-kit/button/button.component';
import {AppConfigInjectionToken, IAppConfig} from '@app/config';

declare var document: any;

@Component({
    selector: 'senat-agenda-item',
    templateUrl: './agenda-item.component.html',
    styleUrls: ['./agenda-item.component.css']
})
export class AgendaItemComponent implements OnInit {

    agendaItemStatus = AgendaItemStatus;

    agendaItemWorkflowAction = AgendaItemWorkflowAction;

    statusLabelColor = StatusLabelColor;

    buttonType = ButtonType;

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

    @Input()
    meetingStatus: MeetingStatus;

    @Input()
    decisions: Array<IDecision>;

    @Output()
    removed: EventEmitter<IAgendaItem> = new EventEmitter<IAgendaItem>();

    @Output()
    stateChanged: EventEmitter<AgendaItemWorkflowAction> = new EventEmitter<AgendaItemWorkflowAction>();

    constructor(private _router: Router,
                @Inject(AppConfigInjectionToken) protected config: IAppConfig) {
    }

    ngOnInit() {
    }

    /**
     * Возвращает перечень доступных действий в соответствии с workflow.
     * @returns {any}
     */
    getActions(): Array<AgendaItemWorkflowAction> { // TODO: вынести в компонент, т.к. дублируется в повестке
        const status = this.agendaItem.status;
        if (this.meetingStatus !== MeetingStatus.Opened) {
            return [];
        }

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
                AgendaItemWorkflowAction.ToRemoved
            ];
        }

        if (status === AgendaItemStatus.OnVoting) {
            return [
                AgendaItemWorkflowAction.ToModification,
                AgendaItemWorkflowAction.ToConsideration,
            ];
        }

        return [];
    }

    getActionsWithoutToRewoved(): Array<AgendaItemWorkflowAction> {
        return this.getActions().filter(action => action !== AgendaItemWorkflowAction.ToRemoved);
    }

    isSupportToRemoved() {
        return this.getActions().some(action => action === AgendaItemWorkflowAction.ToRemoved) && this.changeStateAllowed;
    }

    isAllowedRemove() {
        return this.removeAllowed
            && this.changeStateAllowed
            && this.meetingStatus !== MeetingStatus.Closed
            && this.meetingStatus !== MeetingStatus.Opened;
    }

    calculateColorLabelStatus(): StatusLabelColor {
        switch (this.agendaItem.status) {
            case AgendaItemStatus.WaitingForConsideration:
                return StatusLabelColor.Pink;
            case AgendaItemStatus.OnConsideration:
                return StatusLabelColor.Green;
            case AgendaItemStatus.OnVoting:
                return StatusLabelColor.Opaque;
            case AgendaItemStatus.OnModification:
                return StatusLabelColor.Orange;
            default:
                return StatusLabelColor.Grey;
        }
    }

    getDecisionStatus() {
        if (!this.decisions || this.agendaItem.status !== AgendaItemStatus.Resolved) {
            return null;
        }
        if (this.decisions.some(x => x.accepted)) {
            return 'accepted'
        } else {
            return 'declined'
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


    private get downloadLink() {
        return this.config.api.baseUrl + (this.config.api.baseUrl.endsWith('/') ? '' : '/')
            + `api/v1.0/decisions/download/accepted/agenda/${this.agendaItem.meeting.id}/item/${this.agendaItem.issue.id}`;
    }

    downloadDecision() {
        document.location.href = this.downloadLink;
    }
}
