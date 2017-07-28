import {Component, EventEmitter, Input, OnInit, Output, forwardRef} from '@angular/core';
import {IPerson} from '@app/store/person/person.model';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
    selector: 'senat-person-select-show',
    templateUrl: './person-select-show.component.html',
    styleUrls: ['./person-select-show.component.css'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => PersonSelectShowComponent),
        multi: true
    }]
})
export class PersonSelectShowComponent implements OnInit, ControlValueAccessor {

    @Input()
    suggestions: Array<IPerson> = [];

    @Input()
    showRemoveBtn: boolean;

    @Input()
    multiple = false;

    @Input()
    query: string;

    @Output()
    queryChanged: EventEmitter<string> = new EventEmitter();

    @Output()
    onPersonRemoved: EventEmitter<IPerson> = new EventEmitter();

    @Output()
    onPersonSelected: EventEmitter<IPerson> = new EventEmitter();
    
    
    private persons: IPerson[];

    constructor() {
    }


    onChange = (_) => {
    }
    onTouched = () => {
    }

    ngOnInit() {
    }

    select(person: IPerson) {
        if (this.multiple) {
            this.persons = this.persons.filter(f => f.id !== person.id)
                .concat([person]);
        } else {
            this.persons = [person];
        }

        this.onChange(this.persons);
        this.onPersonSelected.emit(person);
        this.onTouched();
    }

    removePerson(person: IPerson) {
        this.persons = this.persons.filter(f => f.id !== person.id);
        if (this.persons.length === 0) {
            this.persons = null;
        }
        this.onChange(this.persons);
        this.onPersonRemoved.emit(person);
        this.onTouched();
    }

    writeValue(value: IPerson[]) {
        this.persons = value;
    }

    registerOnChange(fn) {
        this.onChange = fn;
    }

    registerOnTouched(fn) {
        this.onTouched = fn;
    }
}
