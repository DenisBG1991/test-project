import { VotingCreatedEvent } from './voting-created-event';

export class VotingUpdatedEvent extends VotingCreatedEvent {
    For: number;
    Against: number;
    Abstain: number;
    Veto: number;
}
