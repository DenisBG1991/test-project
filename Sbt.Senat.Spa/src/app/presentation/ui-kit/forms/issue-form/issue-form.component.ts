import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {ICollegialBody} from '@app/store/collegial-body/collegial-body.model';
import {IPerson} from '@app/store/person/person.model';
import {ILabel} from '@app/store/label';

@Component({
    selector: 'senat-issue-form',
    templateUrl: './issue-form.component.html',
    styleUrls: ['./issue-form.component.css']
    // OnPush не дружит с FormGroup, не стоит пытаться его использовать
    // т.к. при изменении значения формы, ссылка на сам formGroup не изменится
})
export class IssueFormComponent implements OnInit {

    @Input()
    formGroup: FormGroup;

    @Input()
    collegialBodies: Array<ICollegialBody> = [];

    @Input()
    suggestedPersons: Array<IPerson> = [];

    @Input()
    suggestedLabels: Array<ILabel> = [];

    @Input()
    canCreateNewLabel = false;

    @Output()
    labelQueryChanged: EventEmitter<string> = new EventEmitter();

    @Output()
    createNewLabel: EventEmitter<ILabel> = new EventEmitter();
    
    @Output()
    personQueryChanged: EventEmitter<string> = new EventEmitter();

    constructor() {
    }

    ngOnInit() {
    }

}
