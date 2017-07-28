import {IMaterialVersionRef} from '@app/store/material-version/material-version.model';
import {IMeetingRef} from '@app/store/meeting/meeting-ref.model';

/**
 * Голосование.
 */
export interface IVoting {
    id: string;
    meeting: IMeetingRef;
    subject: IMaterialVersionRef;
    votesFor: number;
    votesAbstain: number;
    votesAgainst: number;
    vetoApplied: boolean;
    closed: boolean;
}

export interface IVotingRef {
    id: string;
}
