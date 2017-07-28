import {Component, Input, OnInit} from '@angular/core';
import {IVote} from '@app/store/vote/vote.model';
import {IPerson} from '@app/store/person/person.model';
import {VoteType} from '@app/store/vote/vote-type.model';

@Component({
    selector: 'senat-votes',
    templateUrl: './votes.component.html',
    styleUrls: ['./votes.component.css']
})
export class VotesComponent implements OnInit {

    @Input()
    votes: Array<{ self: IVote, createdBy: IPerson, owner: IPerson }>;

    get votesFor() {
        return this.votes.filter(x => x.self.type === VoteType.For);
    }

    get votesAbstain() {
        return this.votes.filter(x => x.self.type === VoteType.Abstain);
    }

    get votesAgainst() {
        return this.votes.filter(x => x.self.type === VoteType.Against);
    }

    constructor() {
    }

    ngOnInit() {
    }

}
