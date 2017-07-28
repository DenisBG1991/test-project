import {Injectable} from '@angular/core';
import {VotingActions} from '@app/store/voting/voting.actions';
import {VotingService} from '@app/services/api/voting.service';
import {ErrorActions} from '@app/store/error/error.actions';
import {Observable} from 'rxjs/Observable';
import 'rxjs/observable/of';

@Injectable()
export class VotingEpics {

    constructor(private _votingService: VotingService,
                private _votingActions: VotingActions,
                private _errorActions: ErrorActions) {
    }

    loadVotings = $action => $action
        .ofType(VotingActions.LoadAgendaItemVotings)
        .switchMap(action => this._votingService.getVotings(action.payload.agendaItem)
            .map(votings => this._votingActions.loadVotingsComplete(votings))
            .catch(error => Observable.of(this._errorActions.errorOccurred(error))));

    createVoting = action$ => action$
        .ofType(VotingActions.CreateVoting)
        .switchMap(action => this._votingService.createVoting(action.payload.meeting, action.payload.project)
            .map(voting => this._votingActions.loadVotingsComplete([voting]))
            .catch(error => Observable.of(this._errorActions.errorOccurred(error))));

    closeVoting = action$ => action$
        .ofType(VotingActions.CloseVoting)
        .switchMap(action => this._votingService.closeVoting(action.payload.voting)
            .map(voting => this._votingActions.loadVotingsComplete([voting]))
            .catch(error => Observable.of(this._errorActions.errorOccurred(error))));
}
