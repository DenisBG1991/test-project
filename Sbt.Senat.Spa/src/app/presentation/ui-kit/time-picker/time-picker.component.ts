import {Component, ElementRef, forwardRef, Input, OnInit, ViewChild} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import * as moment from 'moment';
import {DropdownComponent} from '@app/presentation/ui-kit/dropdown/dropdown.component';

@Component({
    selector: 'senat-time-picker',
    templateUrl: './time-picker.component.html',
    styleUrls: ['./time-picker.component.css'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => TimePickerComponent),
        multi: true
    }]
})
export class TimePickerComponent extends DropdownComponent implements OnInit, ControlValueAccessor {

    private _value: Date;

    @Input()
    disabled: boolean;

    @Input()
    readonly = true;

    @Input()
    label: string;

    @Input()
    format: string;


    @ViewChild('hours')
    hours: ElementRef;

    @ViewChild('minutes')
    minutes: ElementRef;

    private _onChange: (value: Date) => void = () => {
    };
    private _onTouched: () => void = () => {
    };


    incrementInputValue(target: any): void {
        const step = Number(target.dataset.step);
        target.value = Number(target.value) + step;
        if (target.value > Number(target.dataset.max)) {
            target.value = Number(target.dataset.min);
        }
        if (target.value < 10) {
            target.value = '0' + target.value;
        }
        this.updateValue();
    }

    decrementInputValue(target: any): void {
        const step = Number(target.dataset.step);
        target.value = (Number(target.value) - step);
        if (target.value < Number(target.dataset.min)) {
            target.value = Number(target.dataset.max);
        }
        if (target.value < 10) {
            target.value = '0' + target.value;
        }
        this.updateValue();
    }

    get timeSelected(): string {
        if (!this._value) {
            return null;
        }
        if (this.format) {
            return moment(this._value).format(this.format);
        }
        return `${this._value.getHours()} ч ${this._value.getMinutes()} мин`;
    }

    private updateValue(): void {
        // Change deteciton recognize only references of bounded-property
        this._value = new Date();
        this._value.setHours(Number(this.hours.nativeElement.value));
        this._value.setMinutes(Number(this.minutes.nativeElement.value));
        this._onChange(this._value);
    }

    writeValue(value: Date): void {
        this._value = value;
    }

    registerOnChange(fn: (value: Date) => void): void {
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

    constructor() {
        super();
        this.isAutoRerender = false;
        this.topInputOffset = 2;
    }

    ngOnInit() {
    }
}
