import {Injectable} from '@angular/core';
import {AgendaItemParticipantActions} from '@app/store/agenda-item-participants/agenda-item-participant.actions';
import {AgendaService} from '@app/services/api/agenda.service';
import {ErrorActions} from '@app/store/error/error.actions';
import {PersonActions} from '@app/store/person/person.actions';
import {NgRedux} from '@angular-redux/store';
import {IAppState} from '@app/store/store';
import {AgendaItemParticipantRole} from '@app/store/agenda-item-participants/agenda-item-participant-role.model';
import {Observable} from 'rxjs/Observable';
import 'rxjs/observable/of';
import 'rxjs/observable/concat';
import {AgendaItemLayoutActions} from '@app/store/layout/agenda-item-layout.actions';

@Injectable()
export class AgendaItemParticipantEpics {

    constructor(private _ngRedux: NgRedux<IAppState>,
                private _agendaService: AgendaService,
                private _agendaItemParticipantActions: AgendaItemParticipantActions,
                private _personActions: PersonActions,
                private _errorActions: ErrorActions,
                private _agendaItemLayoutActions: AgendaItemLayoutActions) {
    }

    checkIn = action$ => action$
        .ofType(AgendaItemParticipantActions.CheckInAgendaItemParticipant)
        .flatMap(action => this._agendaService.checkInParticipant(action.payload.participant)
            .switchMap(result => Observable.concat(
                Observable.of(this._personActions.loadPersonsComplete([result.person])),
                Observable.of(this._agendaItemParticipantActions.updateAgendaItemParticipants([result.participant], this._ngRedux.getState().meetingParticipants)),
                Observable.of(this._agendaItemLayoutActions.changeCheckInAttendeeState([result.participant]))
            ))
            .catch(error => Observable.of(this._errorActions.errorOccurred(error))));

    checkOut = action$ => action$
        .ofType(AgendaItemParticipantActions.CheckOutAgendaItemParticipant)
        .flatMap(action => this._agendaService.checkOutParticipant(action.payload.participant)
            .switchMap(result => Observable.concat(
                Observable.of(this._personActions.loadPersonsComplete([result.person])),
                Observable.of(this._agendaItemParticipantActions.updateAgendaItemParticipants([result.participant], this._ngRedux.getState().meetingParticipants)),
                Observable.of(this._agendaItemLayoutActions.changeCheckInAttendeeState([result.participant]))
            ))
            .catch(error => Observable.of(this._errorActions.errorOccurred(error))));

    /**
     * Добавляет участника вопроса.
     * @param action$
     */
    addParticipant = action$ => action$
        .ofType(AgendaItemParticipantActions.AddAgendaItemParticipantRole)
        .switchMap(action => {
            if (action.payload.role === AgendaItemParticipantRole.Speaker) {
                return this._agendaService.addAgendaItemSpeaker(action.payload.agendaItem, action.payload.person)
                    .map(result => this._agendaItemParticipantActions.updateAgendaItemParticipants([result.participant], this._ngRedux.getState().meetingParticipants))
                    .catch(error => Observable.of(this._errorActions.errorOccurred(error)));
            }
            if (action.payload.role === AgendaItemParticipantRole.InvitedOnIssue) {
                return this._agendaService.addAgendaItemInvitedPerson(action.payload.agendaItem, action.payload.person)
                    .map(result => this._agendaItemParticipantActions.updateAgendaItemParticipants([result.participant], this._ngRedux.getState().meetingParticipants))
                    .catch(error => Observable.of(this._errorActions.errorOccurred(error)));
            }

            throw new Error();
        })
        .catch(error => Observable.of(this._errorActions.errorOccurred(error)));

    /**
     * Убирает участника вопроса (конкретную его роль).
     * @param action$
     */
    removeParticipant = action$ => action$
        .ofType(AgendaItemParticipantActions.RemoveAgendaItemParticipantRole)
        .switchMap(action => {
            const participant = this._ngRedux.getState().agendaItemParticipants
                .find(p => p.person.id === action.payload.participant.person.id &&
                p.agendaItem.meeting.id === action.payload.participant.agendaItem.meeting.id &&
                p.agendaItem.issue.id === action.payload.participant.agendaItem.issue.id);

            if (action.payload.role === AgendaItemParticipantRole.Speaker) {
                // действуем оптимистично - сначала делаем (reducer убирает участника уже на 'RemoveAgendaItemParticipantRole'
                // в случае ошибки откатываем действие, возвращая UpdateAgendaItemParticipants
                return this._agendaService.removeAgendaItemSpeaker(action.payload.participant)
                    .map(() => {
                        return {
                            type: 'PING' // epic обязательно должен вернуть action, поэтому возвращаем заглушку
                        };
                    })
                    .catch(error => Observable.concat(
                        Observable.of(
                            this._agendaItemParticipantActions.updateAgendaItemParticipants([participant],
                                this._ngRedux.getState().meetingParticipants)),
                        Observable.of(this._errorActions.errorOccurred(error)))
                    );
            }
            if (action.payload.role === AgendaItemParticipantRole.InvitedOnIssue) {
                // действуем оптимистично - сначала делаем (reducer убирает участника уже на 'RemoveAgendaItemParticipantRole'
                // в случае ошибки откатываем действие, возвращая UpdateAgendaItemParticipants
                return this._agendaService.removeAgendaItemInvitedPerson(action.payload.participant)
                    .map(() => {
                        return {
                            type: 'PING' // epic обязательно должен вернуть action, поэтому возвращаем заглушку
                        };
                    })
                    .catch(error => Observable.concat(
                        Observable.of(
                            this._agendaItemParticipantActions.updateAgendaItemParticipants([participant],
                                this._ngRedux.getState().meetingParticipants)),
                        Observable.of(this._errorActions.errorOccurred(error)))
                    );
            }

            throw new Error();
        })
        .catch(error => Observable.of(this._errorActions.errorOccurred(error)));
}
