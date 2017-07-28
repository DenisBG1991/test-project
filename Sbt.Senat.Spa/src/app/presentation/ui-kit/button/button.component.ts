import {Component, Input, OnInit} from '@angular/core';

export enum ButtonType {
    Green = <any>'green',
    Grey = <any>'grey',
    Blue = <any>'blue',
    Orange = <any>'orange',
    White = <any>'white',
    GreenOutline = <any>'green-outline',
    Red = <any>'red',
    GreenLight = <any>'green-light',
    BlackOutline = <any>'black-outline',
    PurpleMediumOutline = <any>'purple-medium-outline'
}

@Component({
    selector: 'senat-button',
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.css']
})
export class ButtonComponent implements OnInit {

    @Input()
    type = ButtonType.BlackOutline;

    @Input()
    minWidth: number;

    @Input()
    disabled = false;

    constructor() {
    }

    ngOnInit() {
    }

}
