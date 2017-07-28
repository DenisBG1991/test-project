import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IVoting} from '@app/store/voting/voting.model';

@Component({
    selector: 'senat-voting-info',
    templateUrl: './voting-info.component.html',
    styleUrls: ['./voting-info.component.css']
})
export class VotingInfoComponent implements OnInit {

    @Input()
    voting: IVoting;

    @Output()
    pressed: EventEmitter<any> = new EventEmitter();

    constructor() {
    }

    ngOnInit() {
    }

}
