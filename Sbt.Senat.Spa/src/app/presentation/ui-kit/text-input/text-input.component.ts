import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {TextInputStyle} from './text-input-style';

@Component({
    selector: 'senat-text-input',
    templateUrl: './text-input.component.html',
    styleUrls: ['./text-input.component.css'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => TextInputComponent),
        multi: true
    }]
})
export class TextInputComponent implements OnInit, ControlValueAccessor {

    @Input()
    id = '';

    @Input()
    type = 'text';

    @Input()
    disabled = false;

    @Input()
    label: string;

    @Input()
    placeholder = '';

    @Input()
    readonly = false;

    @Input()
    style: TextInputStyle = TextInputStyle.Black;

    @Input()
    isRequired = false;

    private _value: string;

    private _onChange: (value: string) => void = () => {};
    private _onTouched: () => void = () => {};

    get value() {
        return this._value;
    }

    set value(value: string) {
        if (this._value !== value) {
            this._value = value;
            this._onChange(this._value);
        }
    }

    constructor() {
    }

    ngOnInit() {
    }

    writeValue(value: string): void {
        this._value = value;
    }

    registerOnChange(fn: (value: string) => void): void {
        this._onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this._onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    onBlur() {
        this._onTouched();
    }
}
