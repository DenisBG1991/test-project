import {IPersonRef} from '@app/store/person/person.model';
import {VoteType} from '@app/store/vote/vote-type.model';
import {IVotingRef} from '@app/store/voting/voting.model';

/**
 * Голос.
 */
export interface IVote {
    voting: IVotingRef;
    type: VoteType;
    owner: IPersonRef;
    specialOpinion: string;
    createdAt: Date;
    createdBy: IPersonRef;
}
