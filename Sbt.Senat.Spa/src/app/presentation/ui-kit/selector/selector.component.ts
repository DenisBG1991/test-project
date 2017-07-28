import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'senat-selector',
    templateUrl: './selector.component.html',
    styleUrls: ['./selector.component.css']
})
export class SelectorComponent implements OnInit {

    @Input()
    checked = false;

    @Input()
    disabled = false;
    
    constructor() {
    }

    ngOnInit() {
    }

}
