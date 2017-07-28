import {
    ChangeDetectionStrategy, Component, Input, Output, EventEmitter, forwardRef
} from '@angular/core';
import {IPerson} from '@app/store/person/person.model';

@Component({
    selector: 'senat-person-card',
    templateUrl: './person-card.component.html',
    styleUrls: ['./person-card.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PersonCardComponent {
    @Input()
    person: IPerson;

    @Input()
    showRemoveBtn: boolean;

    @Output()
    removePerson: EventEmitter<IPerson> = new EventEmitter<IPerson>();

    removePersonClick($event) {
        this.removePerson.emit(this.person);
    }
}
