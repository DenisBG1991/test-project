import { Component, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'senat-duration',
    templateUrl: './duration.component.html',
    styleUrls: ['./duration.component.css'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DurationComponent),
            multi: true
        }
    ]
})
export class DurationComponent implements OnInit, ControlValueAccessor {

    public readonly nullDateTime = new Date(0, 1, 1, 0, 0, 0);

    value: any; // ������ � 11:30
    _model: Date;

    get model() {
        return this._model;
    }
    set model(value: Date) {
        this._model = value;
        if (value) {
            let h = value.getHours();
            let m = value.getMinutes();

            this.value = `${(h < 10 ? '0' : '')}${h.toString()}:${(m < 10 ? '0' : '')}${m.toString()}`;
        } else {
            this.value = null;
        }
        this.onChange(this.value);
    }

    onChange = (_) => { };
    onTouched = () => { };

    constructor() { }

    ngOnInit() {
    }


    writeValue(value: any) {
        this.value = value;
        if (value) {
            let ms = Date.parse(`0000-01-01 ${value}`);
            if (ms > 0) {
                this._model = new Date(ms);
            } else {
                this._model = null;
            }
        }
    }
    registerOnChange(fn) {
        this.onChange = fn;
    }
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
}
