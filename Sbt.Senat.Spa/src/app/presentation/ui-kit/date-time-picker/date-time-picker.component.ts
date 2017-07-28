import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
    selector: 'senat-date-time-picker',
    templateUrl: './date-time-picker.component.html',
    styleUrls: ['./date-time-picker.component.css'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => DateTimePickerComponent),
        multi: true
    }]
})
export class DateTimePickerComponent implements OnInit, ControlValueAccessor {

    private _value: Date;

    private _timePart: Date;

    private _datePart: Date;

    @Input()
    disabled: boolean;

    get timePart(): Date {
        return this._timePart;
    }

    set timePart(value: Date) {
        if (!value) {
            return;
        }
        if (!this._value) {
            this._value = new Date();
        }
        this._timePart = value;
        this._value.setHours(value.getHours(), value.getMinutes());
        this.notifyOnChange();
    }

    get datePart() {
        return this._datePart;
    }

    set datePart(value: Date) {
        if (!value) {
            return;
        }
        if (!this._value) {
            this._value = new Date();
        }
        this._datePart = value;
        this._value.setFullYear(value.getFullYear(), value.getMonth(), value.getDate());
        this.notifyOnChange();
    }

    private notifyOnChange() {
        this._value = new Date(this._value);
        this._onChange(this._value);
    }

    private _onChange: (value: Date) => void = () => {
    };
    private _onTouched: () => void = () => {
    };

    get value() {
        return this._value;
    }

    set value(value: Date) {
        if (this._value === value) {
            return;
        }
        if (!value) {
            return;
        }
        this.timePart = value;
        this.datePart = value;

        this._value = value;
        this._onChange(this._value);
    }


    constructor() {
    }

    ngOnInit() {
    }

    writeValue(value: Date): void {
        this.value = value;
    }

    registerOnChange(fn: any): void {
        this._onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this._onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }
}
