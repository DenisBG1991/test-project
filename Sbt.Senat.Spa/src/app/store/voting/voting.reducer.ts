import {IVoting} from '@app/store/voting/voting.model';
import {VotingActions} from '@app/store/voting/voting.actions';
import {VoteActions} from '@app/store/vote/vote.actions';
import {IVote} from '@app/store/vote/vote.model';
import {VoteType} from '@app/store/vote/vote-type.model';

export function votingReducer(state: Array<IVoting> = [], action) {
    switch (action.type) {

        case VotingActions.LoadVotingsComplete:
            return state.filter(x => action.payload.votings.find(v => v.id === x.id) == null)
                .concat(action.payload.votings);

        default:
            return state;
    }
}
