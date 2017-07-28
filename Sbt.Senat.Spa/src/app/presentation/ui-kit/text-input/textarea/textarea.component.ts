import {Component, forwardRef, Input} from '@angular/core';
import {TextInputComponent} from '../text-input.component';
import {NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'senat-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TextareaComponent),
    multi: true
  }]
})
export class TextareaComponent extends TextInputComponent {

  @Input()
  rows = 5;

}
