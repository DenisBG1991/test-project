import {Injectable} from '@angular/core';
import {DecisionActions} from '@app/store/decision/decision.actions';
import {MeetingService} from '@app/services/api/meeting.service';
import {ErrorActions} from '@app/store/error/error.actions';
import {Observable} from 'rxjs/Observable';
import 'rxjs/observable/of';
import {MeetingParticipantActions} from '@app/store/meeting-participant/meeting-participant.actions';
import {AgendaItemActions} from '@app/store/agenda-item/agenda-item.actions';

@Injectable()
export class DecisionEpics {

    constructor(private _meetingService: MeetingService,
                private _decisionActions: DecisionActions,
                private _meetingParticipantActions: MeetingParticipantActions,
                private _errorActions: ErrorActions,
                private _agendaItemActions: AgendaItemActions) {

    }

    approveDecision = action$ => action$
        .ofType(DecisionActions.ApproveDecision)
        .switchMap(action => this._meetingService.approveDecision(action.payload.decision)
            .flatMap(decisionApproval => {
                // объяснение _meetingParticipantActions.ping
                // в списке повестки интерфейс подключен к redux.select(x => x.meetingParticipants
                // чтобы он обновился с учетом изменений по decison, его требуется принудительно обновить
                return Observable.concat(
                    Observable.of(this._decisionActions.approveDecisionComplete(action.payload.decision, decisionApproval)),
                    Observable.of(this._meetingParticipantActions.ping())
                );
            })
            .catch(error => Observable.of(this._errorActions.errorOccurred(error))));

    loadDecisions = action$ => action$
        .ofType(DecisionActions.LoadDecisions)
        .switchMap(action => this._meetingService.getDecisions({
                meetingId: action.payload.meeting.id,
                issueId: null
            },
            {
                pageNum: 1,
                pageSize: 1000
            })
            .map(page => this._decisionActions.loadDecisionsComplete(page.items))
            .catch(error => Observable.of(this._errorActions.errorOccurred(error))));

    createDecision = action$ => action$
        .ofType(DecisionActions.CreateDecision)
        .switchMap(action => this._meetingService.createDecision(action.payload.decision)
            .flatMap(decision => Observable.concat(
                Observable.of(this._decisionActions.loadDecisionsComplete([decision])),
                Observable.of(this._agendaItemActions.loadSingleAgendaItem({issue: decision.issue, meeting: decision.meeting})))
            )
            .catch(error => Observable.of(this._errorActions.errorOccurred(error))));

    sendDecisionToApproval = action$ => action$
        .ofType(DecisionActions.SendDecisionToApproval)
        .switchMap(action => this._meetingService.sendDecisionToApproval(action.payload.decision, action.payload.person)
            .map(decision => this._decisionActions.loadDecisionsComplete([decision]))
            .catch(error => Observable.of(this._errorActions.errorOccurred(error))));
}
