import {Component, Input, OnInit} from '@angular/core';
import {CloseButtonType} from '@app/presentation/ui-kit/button/close-button/close-button.component';

@Component({
    selector: 'senat-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

    closeButtonType = CloseButtonType;

    @Input()
    title: string;

    @Input()
    isClosable = false;

    @Input()
    cardHeight: number;

    constructor() {
    }

    ngOnInit() {
    }
}
