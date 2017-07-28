import {IVote} from '@app/store/vote/vote.model';
import {VoteActions} from '@app/store/vote/vote.actions';

export function voteReducer(state: Array<IVote> = [], action) {
    switch (action.type) {

        case VoteActions.LoadVotesComplete:
            return state.filter(v => action.payload.votes.find(vv => vv.voting.id === v.voting.id &&
                vv.owner.id === v.owner.id) == null)
                .concat(action.payload.votes);

        default:
            return state;
    }
}
