
import {Injectable} from '@angular/core';
import {MeetingActions} from '@app/store/meeting/meeting.actions';
import {Observable} from 'rxjs/Observable';
import {MaterialService} from '@app/services/api/material.service';
import {ErrorActions} from '@app/store/error/error.actions';
import {PersonActions} from '@app/store/person/person.actions';
import {MaterialVersionActions} from '@app/store/material-version/material-version.actions';

@Injectable()
export class MeetingMaterialEpics {

    constructor(private _materialService: MaterialService,
                private _meetingActions: MeetingActions,
                private _personActions: PersonActions,
                private _materialVersionActions: MaterialVersionActions,
                private _errorActions: ErrorActions) {

    }

    loadProtocol = action$ => action$
        .ofType(MeetingActions.LoadMeetingProtocol)
        .switchMap(action => this._materialService.getMeetingProtocol(action.payload.meeting)
            .switchMap(result => {
                return Observable.concat(
                    Observable.of(this._personActions.loadPersonsComplete([result.person])),
                    Observable.of(this._materialVersionActions.loadMaterialVersionsComplete([result.version])),
                    Observable.of(this._meetingActions.loadMeetingProtocolComplete(result.material)));
            })
            .catch(error => Observable.of(this._errorActions.errorOccurred(error))));
}
