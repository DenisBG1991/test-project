import {Injectable} from '@angular/core';
import {IVote} from '@app/store/vote/vote.model';
import {IVotingRef} from '@app/store/voting/voting.model';
import {FormGroup} from '@angular/forms';

@Injectable()
export class VoteActions {

    static readonly LoadVotes = 'LOAD_VOTES';
    static readonly LoadVotesComplete = 'LOAD_VOTES_COMPLETE';
    static readonly CreateVote = 'CREATE_VOTE';

    loadVotes(voting: IVotingRef) {
        return {
            type: VoteActions.LoadVotes,
            payload: {
                voting: voting
            }
        };
    }

    loadVotesComplete(votes: Array<IVote>) {
        return {
            type: VoteActions.LoadVotesComplete,
            payload: {
                votes: votes
            }
        };
    }

    createVote(vote: IVote) {
        return {
            type: VoteActions.CreateVote,
            payload: {
                vote: vote
            }
        };
    }
}
