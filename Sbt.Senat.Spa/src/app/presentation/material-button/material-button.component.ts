import {Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy} from '@angular/core';

@Component({
    selector: 'senat-material-button',
    templateUrl: './material-button.component.html',
    styleUrls: ['./material-button.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MaterialButtonComponent implements OnInit {

    @Input()
    size = 2.5;

    @Input()
    type = 'add';

    @Input()
    buttonPressed = false;

    @Input()
    btnClass = 'btn-secondary';

    @Output()
    buttonPress: EventEmitter<any> = new EventEmitter();

    constructor() {
    }

    ngOnInit() {
    }
}
