import {Component, OnInit, Input, Inject, forwardRef} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {IPrimengLocale} from '@app/presentation/localization/primeng-locale';
import {PrimengLocaleInjectionToken} from '@app/presentation/localization/primeng-locale-provider';

@Component({
    selector: 'senat-calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.css'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => CalendarComponent),
        multi: true
    }]
})
export class CalendarComponent implements OnInit, ControlValueAccessor {

    @Input()
    placeholder = '';

    @Input()
    disabled = false;

    @Input()
    showTime = true;

    @Input()
    timeOnly = false;

    private _date: Date;

    get date(): Date {
        return this._date;
    }

    set date(date: Date) {
        if (this._date !== date) {
            this._date = date;
            this._onChange(this._date);
        }
    }

    private _onChange: (date: Date) => void =
        () => {};

    constructor(@Inject(PrimengLocaleInjectionToken) public primengLocale: IPrimengLocale) {
    }

    ngOnInit() {
    }

    writeValue(date: Date): void {
        this._date = date;
    }

    registerOnChange(fn: any): void {
        this._onChange = fn;
    }

    registerOnTouched(fn: any): void {
    }
}
