import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Person} from '@app/presentation/ui-kit/person-picker/person';
import {DropdownComponent} from '@app/presentation/ui-kit/dropdown/dropdown.component';

@Component({
    selector: 'senat-person-picker-1',
    templateUrl: './person-picker-1.component.html',
    styleUrls: ['./person-picker-1.component.css']
})
export class PersonPicker1Component extends DropdownComponent implements OnInit {

    @Input()
    avatarPlaceholder = '';

    @Input()
    confirmation = false;

    @Input()
    multiple = false;

    /**
     * Направление отображения выпадающей панели относительно кнопки:
     * auto,
     * top-right,
     * top-left,
     * bottom-left,
     * bottom-right
     */
    @Input()
    orientation = 'auto';

    @Input()
    searchInProgress = false;

    @Output()
    selectItems: EventEmitter<Array<Person>> = new EventEmitter<Array<Person>>();

    @Input()
    selected: Array<Person> = [];

    @Input()
    expanded = false;

    @Input()
    suggestions: Array<Person> = [];

    @ViewChild('toggleButton')
    toggleButton: ElementRef; // кнопка

    @Output()
    queryChanged: EventEmitter<string> = new EventEmitter<string>();

    @Input()
    disabled = false;

    constructor() {
        super();
        this.isAutoRerender = false;
    }

    ngOnInit(): void {
    }


    calculateCoordinationStyle() {
        const toggleButtonPosition = this.toggleButton.nativeElement.getBoundingClientRect();
        const clientAreaCenter = {x: window.innerWidth / 2, y: window.innerHeight / 2};

        if (this.orientation === 'bottom-left' || (this.orientation === 'auto'
            && toggleButtonPosition.left >= clientAreaCenter.x && toggleButtonPosition.top < clientAreaCenter.y)) {
            // первая четверть
            this.topInputOffset = -60;
            this.leftInputOffset = -410;

        } else if (this.orientation === 'bottom-right' || (this.orientation === 'auto'
            && toggleButtonPosition.left < clientAreaCenter.x && toggleButtonPosition.top < clientAreaCenter.y)) {
            // вторая четверть
            this.topInputOffset = -60;
            this.leftInputOffset = 70;

        } else if (this.orientation === 'top-right' || (this.orientation === 'auto'
            && toggleButtonPosition.left < clientAreaCenter.x && toggleButtonPosition.top >= clientAreaCenter.y)) {
            // третья четверть
            this.topInputOffset = -479;
            this.leftInputOffset = 70;

        } else if (this.orientation === 'top-left' || (this.orientation === 'auto')) {
            // четвёртая четверть
            this.topInputOffset = -479;
            this.leftInputOffset = -410;
        }
        return super.calculateCoordinationStyle();
    }


    onSelect(persons: Array<Person>) {
        this.selectItems.emit(persons);

        if (!this.multiple || this.confirmation) {
            this.hide();
        }
    }
}
