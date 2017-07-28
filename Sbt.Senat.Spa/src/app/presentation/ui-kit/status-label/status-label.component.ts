import {Component, Input, OnInit} from '@angular/core';
import {StatusLabelColor} from './status-label-style';

@Component({
    selector: 'senat-status-label',
    templateUrl: './status-label.component.html',
    styleUrls: ['./status-label.component.css']
})
export class StatusLabelComponent implements OnInit {

    @Input()
    color: StatusLabelColor = StatusLabelColor.Grey;

    constructor() {
    }

    ngOnInit() {
    }

}
