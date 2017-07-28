import {Component, Input, OnInit} from '@angular/core';
import {IVote} from '@app/store/vote/vote.model';
import {IPerson} from '@app/store/person/person.model';

@Component({
    selector: 'senat-vote',
    templateUrl: './vote.component.html',
    styleUrls: ['./vote.component.css']
})
export class VoteComponent implements OnInit {

    @Input()
    vote: { self: IVote, createdBy: IPerson, owner: IPerson };

    constructor() {
    }

    ngOnInit() {
    }

}
