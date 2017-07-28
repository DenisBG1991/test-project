import {Component, forwardRef, Input} from '@angular/core';
import {TextInputComponent} from '../text-input.component';
import {NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
    selector: 'senat-text-input-with-icon',
    templateUrl: './text-input-with-icon.component.html',
    styleUrls: ['./text-input-with-icon.component.css'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => TextInputWithIconComponent),
        multi: true
    }]
})
export class TextInputWithIconComponent extends TextInputComponent {

    constructor() {
        super();
    }

}
