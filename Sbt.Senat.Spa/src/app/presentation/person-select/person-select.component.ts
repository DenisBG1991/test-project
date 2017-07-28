import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IPerson} from '@app/store/person/person.model';

@Component({
    selector: 'senat-person-select',
    templateUrl: './person-select.component.html',
    styleUrls: ['./person-select.component.css']
})
export class PersonSelectComponent implements OnInit {

    expanded = false;

    @Input()
    selected: Array<IPerson> = [];

    @Input()
    suggestions: Array<IPerson> = [];

    @Input()
    query: string;

    @Output()
    selectPerson: EventEmitter<IPerson> = new EventEmitter();

    @Output()
    queryChanged: EventEmitter<string> = new EventEmitter();

    constructor() {
    }

    ngOnInit() {

    }

    isSelected(person: IPerson) {
        if (this.selected) {
            return this.selected.find(p => p.id === person.id) != null;
        }

        return false;
    }
}
