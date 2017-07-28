import {Injectable} from '@angular/core';
import {MeetingParticipantActions} from '@app/store/meeting-participant/meeting-participant.actions';
import {MeetingService} from '@app/services/api/meeting.service';
import {PersonActions} from '@app/store/person/person.actions';
import {ErrorActions} from '@app/store/error/error.actions';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/concat';
import 'rxjs/add/observable/of';

@Injectable()
export class MeetingParticipantEpics {

    constructor(private _meetingService: MeetingService,
                private _meetingParticipantActions: MeetingParticipantActions,
                private _personActions: PersonActions,
                private _errorActions: ErrorActions) {

    }

    loadMeetingParticipants = action$ => action$
        .ofType(MeetingParticipantActions.LoadMeetingParticipants)
        .switchMap(action => {
            return this._meetingService.getParticipants(action.payload.meeting)
                .switchMap(result => {
                    // возвращаем 2 экшена - обновление персон и обновление участников
                    return Observable.concat(
                        // Fire 2 actions, one after the other
                        Observable.of(this._personActions.loadPersonsComplete(result.persons)),
                        Observable.of(this._meetingParticipantActions.loadMeetingParticipantsComplete(
                            result.participants))
                    );
                })
                .catch(error => Observable.concat(
                    Observable.of(this._meetingParticipantActions.loadMeetingParticipantsFail(error)),
                    Observable.of(this._errorActions.errorOccurred(error)))
                );
        });

    addInvitedPerson = action$ => action$
        .ofType(MeetingParticipantActions.AddInvitedPerson)
        .switchMap(action => {
            return this._meetingService.addInvitedPerson(action.payload.meeting,
                action.payload.person)
                .switchMap(result => {
                    // возвращаем 2 экшена - обновление персон и обновление участников
                    return Observable.concat(
                        // Fire 2 actions, one after the other
                        Observable.of(this._personActions.loadPersonsComplete(result.persons)),
                        Observable.of(this._meetingParticipantActions.loadMeetingParticipantsComplete(
                            [result.participant]))
                    );
                })
                .catch(error => Observable.concat(
                    Observable.of(this._meetingParticipantActions.loadMeetingParticipantsFail(error)),
                    Observable.of(this._errorActions.errorOccurred(error)))
                );
        });

    removeInvitedPerson = action$ => action$
        .ofType(MeetingParticipantActions.RemoveInvitedPerson)
        .switchMap(action => {
            return this._meetingService.removeInvitedPerson(action.payload.meeting,
                action.payload.person)
                .map(() => this._meetingParticipantActions.removeInvitedPersonComplete(action.payload.meeting,
                    action.payload.person))
                .catch(error => Observable.concat(
                    Observable.of(this._meetingParticipantActions.removeInvitedPersonFail(error)),
                    Observable.of(this._errorActions.errorOccurred(error)))
                );
        });
}
