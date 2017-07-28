import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {NgRedux} from '@angular-redux/store';
import {IAppState} from '@app/store/store';
import {Observable} from 'rxjs/Observable';
import {IMeetingRef} from '@app/store/meeting/meeting-ref.model';
import {AgendaActions} from '@app/store/agenda/agenda.actions';
import {MeetingParticipantActions} from '@app/store/meeting-participant/meeting-participant.actions';
import {IMeetingParticipant} from '@app/store/meeting-participant/meeting-participant.model';
import {IAgendaItem} from '@app/store/agenda-item/agenda-item.model';
import {MeetingActions} from '@app/store/meeting/meeting.actions';
import {PermissionActions} from '@app/store/permission/permission.actions';
import {DecisionActions} from '@app/store/decision/decision.actions';

@Component({
    selector: 'senat-meeting-page-content',
    templateUrl: './meeting-page-content.component.html',
    styleUrls: ['./meeting-page-content.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MeetingPageContentComponent implements OnInit {

    meeting: IMeetingRef;

    agendaItems$: Observable<Array<IAgendaItem>> =
        this._ngRedux.select(x => x.agendaItems.filter(i => i.meeting.id === this.meeting.id));
    // TODO: order by 'order'

    participants$: Observable<Array<IMeetingParticipant>> = this._ngRedux.select(x => x.meetingParticipants
        .filter(p => p.meeting.id === this.meeting.id));

    constructor(private _route: ActivatedRoute,
                private _ngRedux: NgRedux<IAppState>,
                private _agendaActions: AgendaActions,
                private _meetingActions: MeetingActions,
                private _meetingParticipantActions: MeetingParticipantActions,
                private _permissionActions: PermissionActions,
                private _decisionActions: DecisionActions) {
    }

    ngOnInit() {
        this._route.params.forEach((params: Params) => {

            this.meeting = {
                id: params['id']
            };

            this._ngRedux.dispatch(this._meetingActions.loadSingleMeeting(this.meeting));
            this._ngRedux.dispatch(this._decisionActions.loadDecisions(this.meeting));
            this._ngRedux.dispatch(this._meetingActions.loadSingleMeeting(this.meeting));
            this._ngRedux.dispatch(this._permissionActions.addMeetingPermissions(this.meeting));
            this._ngRedux.dispatch(this._agendaActions.getAgenda(this.meeting));
            this._ngRedux.dispatch(this._meetingParticipantActions.loadMeetingParticipants(this.meeting));
        });
    }
}
