import {Injectable} from '@angular/core';
import {VoteActions} from '@app/store/vote/vote.actions';
import {VotingActions} from '@app/store/voting/voting.actions';
import {VotingService} from '@app/services/api/voting.service';
import {ErrorActions} from '@app/store/error/error.actions';
import {Observable} from 'rxjs/Observable';
import {PersonActions} from '@app/store/person/person.actions';
import 'rxjs/observable/concat';
import 'rxjs/observable/of';

@Injectable()
export class VoteEpics {

    constructor(private _votingService: VotingService,
                private _voteActions: VoteActions,
                private _votingActions: VotingActions,
                private _personActions: PersonActions,
                private _errorActions: ErrorActions) {

    }

    loadVotes = action$ => action$
        .ofType(VoteActions.LoadVotes)
        .switchMap(action => this._votingService.getVotes(action.payload.voting)
            .switchMap(result => {
                return Observable.concat(
                    Observable.of(this._personActions.loadPersonsComplete(result.persons)),
                    Observable.of(this._voteActions.loadVotesComplete(result.votes))
                );
            })
            .catch(error => Observable.of(this._errorActions.errorOccurred(error))));

    createVote = action$ => action$
        .ofType(VoteActions.CreateVote)
        .switchMap(action => this._votingService.createVote(action.payload.vote)
            .switchMap(result => this._votingService.getVoting(result.vote.voting)
                .switchMap(voting => {
                    return Observable.concat(
                        Observable.of(this._personActions.loadPersonsComplete(result.persons)),
                        Observable.of(this._votingActions.loadVotingsComplete([voting])),
                        Observable.of(this._voteActions.loadVotesComplete([result.vote]))
                    );
                })
                .catch(error => Observable.of(this._errorActions.errorOccurred(error))))
            .catch(error => Observable.of(this._errorActions.errorOccurred(error))));
}
