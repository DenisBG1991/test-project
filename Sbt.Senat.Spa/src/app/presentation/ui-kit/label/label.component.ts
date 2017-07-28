import {Component, Input, OnInit} from '@angular/core';

/**
 * A component to incapsulate label styles (.css).
 */
@Component({
    selector: 'senat-label',
    templateUrl: './label.component.html',
    styleUrls: ['./label.component.css']
})
export class LabelComponent implements OnInit {

    @Input()
    for: string = null;

    @Input()
    text = '';

    constructor() {
    }

    ngOnInit() {
    }

}
