import {Component, Input, OnInit} from '@angular/core';
import {IVoting} from '@app/store/voting/voting.model';

@Component({
    selector: 'senat-voting-bar',
    templateUrl: './voting-bar.component.html',
    styleUrls: ['./voting-bar.component.css']
})
export class VotingBarComponent implements OnInit {

    @Input()
    voting: IVoting;

    get percentageFor(): number {
        return Math.floor(this.voting.votesFor * 100 / this.votesPercentageDivider);
    }

    get percentageAbstain(): number {
        return 100 - this.percentageFor - this.percentageAgainst;
    }

    get percentageAgainst(): number {
        return Math.floor(this.voting.votesAgainst * 100 / this.votesPercentageDivider);
    }

    get votesPercentageDivider() {
        const sum = this.voting.votesFor + this.voting.votesAbstain + this.voting.votesAgainst;
        return sum === 0 ? 1 : sum; // чтобы не делить на ноль
    }

    constructor() {
    }

    ngOnInit() {
    }
}
