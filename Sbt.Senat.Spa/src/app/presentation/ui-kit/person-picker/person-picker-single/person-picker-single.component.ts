import {Component, EventEmitter, forwardRef, Input, OnInit, Output} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {IPerson} from '@app/store/person/person.model';

/**
 * Allows to select a single person.
 * Implements ControlValueAccessor, can be used in forms.
 */
@Component({
    selector: 'senat-person-picker-single',
    templateUrl: './person-picker-single.component.html',
    styleUrls: ['./person-picker-single.component.css'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => PersonPickerSingleComponent),
        multi: true
    }]
})
export class PersonPickerSingleComponent implements OnInit, ControlValueAccessor {

    avatarPlaceholder = 'assets/avatar-placeholder.png';

    @Input()
    label: string;

    @Input()
    suggestions: Array<IPerson> = [];

    @Input()
    multiple = false;

    @Input()
    disabled = false;

    @Output()
    queryChanged: EventEmitter<string> = new EventEmitter<string>();

    private _value: IPerson;

    private _onChange: (value: IPerson) => void = () => {};
    private _onTouched: () => void = () => {};

    get person() {
        return this._value;
    }

    set person(value: IPerson) {
        if (this._value !== value) {
            this._value = value;
            this._onChange(value);
        }
    }

    constructor() {
    }

    ngOnInit() {
    }

    writeValue(value: IPerson): void {
        this._value = value;
    }

    registerOnChange(fn: any): void {
        this._onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this._onTouched = fn;
    }

    setDisabledState(isDisabled: boolean) {
        this.disabled = isDisabled;
    }

    select(persons: Array<IPerson>) {
        this.person = persons[0];
    }
}
