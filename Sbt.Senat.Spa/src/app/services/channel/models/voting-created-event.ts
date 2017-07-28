export class VotingCreatedEvent {
    Id: string;
    Meeting: {
        Id: string;
    };
    DecisionProject: {
        Id: string;
        Version: number;
    };
}
