import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {NgRedux} from '@angular-redux/store';
import {IAppState} from '@app/store/store';
import {IMeeting, IMeetingAbsentia, IMeetingPresentia, MeetingType} from '@app/store/meeting/meeting.model';
import {IAgendaItem, IAgendaItemRef} from '@app/store/agenda-item/agenda-item.model';
import {ActivatedRoute} from '@angular/router';
import {AgendaItemActions} from '@app/store/agenda-item/agenda-item.actions';
import {AgendaItemStatus} from '@app/store/agenda-item/agenda-item-status.model';
import {AgendaItemWorkflowAction} from '@app/store/agenda-item/agenda-item-workflow-action';
import {PermissionEnum} from '@app/store/permission';
import {PermissionSelectors} from '@app/store/permission/permission.selectors';
import {LocaleDatePipe, LocaleService} from 'angular-l10n';
import {StatusLabelColor} from '@app/presentation/ui-kit/status-label/status-label-style';
import {MeetingStatus} from '@app/store/meeting/meeting-status';
import {IDecision} from '@app/store/decision/decision.model';

@Component({
    selector: 'senat-agenda-item-page-header',
    templateUrl: './agenda-item-page-header.component.html',
    styleUrls: ['./agenda-item-page-header.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgendaItemPageHeaderComponent implements OnInit {

    agendaItemStatus = AgendaItemStatus;
    meetingType = MeetingType;
    agendaItemWorkflowAction = AgendaItemWorkflowAction;

    statusLabelColor = StatusLabelColor;
    /**
     * Данные отображаемого вопроса'а.
     */
    agendaItemRef: IAgendaItemRef;

    agendaItem: IAgendaItem; // немножко костыль, см. ngOnInit()

    meeting: IMeeting;

    canEdit$: Observable<boolean>;
    //noinspection JSUnusedGlobalSymbols
    /**
     * Текущее заседание.
     * @returns {Observable<S>}
     */
    meeting$: Observable<IMeeting> =
        this._ngRedux.select(x => x.meetings.items.find(m => this.agendaItem && m.id === this.agendaItem.meeting.id));

    decisions$: Observable<Array<IDecision>> =
        this._ngRedux.select(x => x.decisions.filter(d => d.issue.id === this.agendaItem.issue.id
        && d.meeting.id === this.agendaItem.meeting.id));

    decisions: Array<IDecision>;

    //noinspection JSUnusedGlobalSymbols
    /**
     * Текущий вопрос повестки.
     * @returns {Observable<S>}
     */
    agendaItem$: Observable<any> =
        this._ngRedux.select(x => x.agendaItems
            .find(i => i.meeting.id === this.agendaItemRef.meeting.id && i.issue.id === this.agendaItemRef.issue.id));

    constructor(private _ngRedux: NgRedux<IAppState>,
                private _route: ActivatedRoute,
                private _agendaItemActions: AgendaItemActions,
                private _permissionSelectors: PermissionSelectors,
                private _locale: LocaleService) {
    }

    ngOnInit() {
        // details-компонент отображается в верхней части шаблона (см. routing)
        // основным компонентом страницы считается AgendaItemPageContentComponent,
        // именно он и инициирует загрузку данных при переходе на страницу

        this._route.params.forEach(params => {
            this.agendaItemRef = {
                meeting: {
                    id: params['meetingId']
                },
                issue: {
                    id: params['issueId']
                }
            };
        });

        this.canEdit$ = this.hasPermission$(PermissionEnum.EditMeeting);

        this._ngRedux.select(x => x.agendaItems
            .find(i => i.meeting.id === this.agendaItemRef.meeting.id && i.issue.id === this.agendaItemRef.issue.id))
            .subscribe(item => {
                this.agendaItem = item;
            }); // TODO: обойтись без объявления допольнительного поля

        this.meeting$.subscribe(meeting => this.meeting = meeting);

        this.decisions$.subscribe(d => this.decisions = d);
    }

    /**
     * Возвращает перечень доступных действий в соответствии с workflow.
     * @returns {any}
     */
    getActions(): Array<AgendaItemWorkflowAction> { // TODO: вынести в компонент, т.к. дублируется в повестке
        if (this.meeting.state !== MeetingStatus.Opened) {
            return [];
        }

        if (this.agendaItem.status === AgendaItemStatus.WaitingForConsideration) {
            return [
                AgendaItemWorkflowAction.ToConsideration,
                AgendaItemWorkflowAction.ToVoting,
                AgendaItemWorkflowAction.ToRemoved
            ];
        }
        if (this.agendaItem.status === AgendaItemStatus.OnConsideration) {
            return [
                AgendaItemWorkflowAction.ToModification,
                AgendaItemWorkflowAction.ToVoting,
                AgendaItemWorkflowAction.ToRemoved
            ];
        }

        if (this.agendaItem.status === AgendaItemStatus.OnVoting) {
            return [
                AgendaItemWorkflowAction.ToModification,
                AgendaItemWorkflowAction.ToConsideration
            ];
        }

        return [];
    }

    getActionsWithoutToRewoved(): Array<AgendaItemWorkflowAction> {
        return this.getActions().filter(action => action !== AgendaItemWorkflowAction.ToRemoved);
    }

    isSupportToRemoved() {
        return this.getActions().some(action => action === AgendaItemWorkflowAction.ToRemoved);
    }

    /**
     * Изменение статуса вопроса в повестке.
     * @param action
     */
    move(action: AgendaItemWorkflowAction) {
        this._ngRedux.dispatch(this._agendaItemActions.moveAgendaItemState(this.agendaItem, action));
    }

    hasPermission$(permission: PermissionEnum): Observable<boolean> {
        return this._ngRedux.select(this._permissionSelectors.meetingHasPermision(permission, this.agendaItemRef.meeting));
    }

    get meetingInfo() {
        if (!this.meeting) {
            return null;
        }
        const datePipe = new LocaleDatePipe();
        const locale = this._locale.getDefaultLocale();
        if (this.meeting.type === MeetingType.Presentia) {
            const meetingPresentia = <IMeetingPresentia>this.meeting;
            const address = meetingPresentia.address ? meetingPresentia.address : '';
            const place = meetingPresentia.place ? meetingPresentia.place : '';
            return `№ ${meetingPresentia.num} от ${datePipe.transform(meetingPresentia.date, locale, 'medium')} в ${address} ${place}`;
        } else if (this.meeting.type === MeetingType.Absentia) {
            const meetingAbsentia = <IMeetingAbsentia>this.meeting;
            return `№ ${meetingAbsentia.num} от ${datePipe.transform(meetingAbsentia.startDate, locale, 'medium')}`;
        } else {
            return null;
        }
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
}
