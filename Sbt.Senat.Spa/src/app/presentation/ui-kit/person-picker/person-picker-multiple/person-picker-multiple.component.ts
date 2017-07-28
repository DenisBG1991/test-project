import {Component, ContentChild, EventEmitter, forwardRef, Input, OnInit, Output, TemplateRef} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {IPerson} from '@app/store/person/person.model';

/**
 * Allows to select multiple persons.
 * Implements ControlValueAccessor, can be used in forms.
 */
@Component({
    selector: 'senat-person-picker-multiple',
    templateUrl: './person-picker-multiple.component.html',
    styleUrls: ['./person-picker-multiple.component.css'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => PersonPickerMultipleComponent),
        multi: true
    }]
})
export class PersonPickerMultipleComponent implements OnInit, ControlValueAccessor {

    avatarPlaceholder = 'assets/avatar-placeholder.png';

    @ContentChild(TemplateRef) personTemplate;

    @Input()
    label: string;

    @Input()
    suggestions: Array<IPerson> = [];

    @Input()
    disabled = false;

    @Output()
    queryChanged: EventEmitter<string> = new EventEmitter<string>();

    @Output()
    removed: EventEmitter<IPerson> = new EventEmitter<IPerson>();

    @Output()
    selected: EventEmitter<IPerson> = new EventEmitter<IPerson>();

    private _value: Array<IPerson> = [];

    private _onChange: (value: Array<IPerson>) => void = () => {
    };
    private _onTouched: () => void = () => {
    };

    get persons() {
        return this._value;
    }

    set persons(value: Array<IPerson>) {
        if (!value) {
            value = [];
        }
        if (this._value !== value
            || this._value.length !== value.length) {
            this._value = value;
            this._onChange(value);
        }
    }

    constructor() {
    }

    ngOnInit() {
    }

    writeValue(value: Array<IPerson>): void {
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
        const prsns = this.persons;
        prsns.push(persons[0]);
        this.persons = prsns;
        this.selected.emit(persons[0]);
    }

    remove(person: IPerson) {
        this.persons = this.persons.filter(f => f.id !== person.id);
        this.removed.emit(person);
    }
}
