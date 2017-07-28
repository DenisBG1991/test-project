import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Person} from './person';

@Component({
    selector: 'senat-person-picker',
    templateUrl: './person-picker.component.html',
    styleUrls: ['./person-picker.component.css']
})
export class PersonPickerComponent implements OnInit {

    @Input()
    avatarPlaceholder = '';

    @Input()
    confirmation = false;

    @Input()
    multiple = false;

    @Input()
    searchInProgress = false;

    @Output()
    select: EventEmitter<Array<Person>> = new EventEmitter<Array<Person>>();

    @Input()
    selected: Array<Person> = [];

    @Input()
    suggestions: Array<Person> = [];

    query = '';

    @Output()
    queryChanged: EventEmitter<string> = new EventEmitter<string>();

    constructor() {
    }

    ngOnInit() {
    }

    add(person: Person) {
        if (this.multiple) {
            if (!this.selected.some(p => p.id === person.id)) {
                this.selected.push(person);

                if (!this.confirmation) {
                    this.select.emit(this.selected);
                }
            }
        } else {
            this.selected = [person];
            if (!this.confirmation) {
                this.select.emit(this.selected);
            }
        }
    }

    remove(e, person: Person) {
        // здесь мы убираем элемент из списка и тем самым убираем элемент из DOM
        // если не остановить эскалацию события,
        // в обработчике document:click вызов dropdown.nativeElement.contains(event.target) вернёт false,
        // и панель будет скрыта
        e.stopPropagation();

        const selected = this.selected.find(p => p.id === person.id);

        if (selected) {
            const index = this.selected.indexOf(selected);
            this.selected.splice(index, 1);
        }
    }

    confirmSelection() {
        this.select.emit(this.selected);
    }
}
