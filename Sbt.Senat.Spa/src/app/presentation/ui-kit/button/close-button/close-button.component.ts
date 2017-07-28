import {Component, Input, OnInit} from '@angular/core';

export enum CloseButtonType {
    Orange = <any>'orange',
    Black = <any>'black'
}

@Component({
    selector: 'senat-close-button',
    templateUrl: './close-button.component.html',
    styleUrls: ['./close-button.component.css']
})
export class CloseButtonComponent implements OnInit {

    @Input()
    size = 20;

    @Input()
    type = CloseButtonType.Orange;

    constructor() {
    }

    ngOnInit() {
    }

}
