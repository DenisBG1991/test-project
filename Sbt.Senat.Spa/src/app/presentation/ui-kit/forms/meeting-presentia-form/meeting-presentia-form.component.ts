import {Component, OnInit, Input} from '@angular/core';
import {ICollegialBody} from '@app/store/collegial-body/collegial-body.model';

@Component({
    selector: 'senat-meeting-presentia-form',
    templateUrl: './meeting-presentia-form.component.html',
    styleUrls: ['./meeting-presentia-form.component.css']
    // OnPush не дружит с FormGroup, не стоит пытаться его использовать
    // т.к. при изменении значения формы, ссылка на сам formGroup не изменится
})
export class MeetingPresentiaFormComponent implements OnInit {

    @Input()
    collegialBodies: Array<ICollegialBody> = [];

    @Input()
    formGroup;

    constructor() {
    }

    ngOnInit() {
    }
}
