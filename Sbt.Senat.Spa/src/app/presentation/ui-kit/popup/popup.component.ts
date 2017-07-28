import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'senat-popup',
    templateUrl: './popup.component.html',
    styleUrls: ['./popup.component.css']
})
export class PopupComponent implements OnInit {

    shown = false;

    constructor() {
    }

    ngOnInit() {
    }

    show() {
        this.shown = true;
    }

    hide() {
        this.shown = false;
    }
}
