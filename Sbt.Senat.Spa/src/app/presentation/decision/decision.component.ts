import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {IDecision} from '@app/store/decision/decision.model';

@Component({
    selector: 'senat-decision',
    templateUrl: './decision.component.html',
    styleUrls: ['./decision.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DecisionComponent implements OnInit {

    @Input()
    decision: IDecision;

    constructor() {
    }

    ngOnInit() {
    }

}
