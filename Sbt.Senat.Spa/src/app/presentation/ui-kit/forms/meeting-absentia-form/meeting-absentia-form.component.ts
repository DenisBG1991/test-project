import {Component, OnInit, Input} from '@angular/core';
import {ICollegialBody} from '@app/store/collegial-body/collegial-body.model';

@Component({
    selector: 'senat-meeting-absentia-form',
    templateUrl: './meeting-absentia-form.component.html',
    styleUrls: ['./meeting-absentia-form.component.css']
    // OnPush не дружит с FormGroup, не стоит пытаться его использовать
    // т.к. при изменении значения формы, ссылка на сам formGroup не изменится
})
export class MeetingAbsentiaFormComponent implements OnInit {

    @Input()
    collegialBodies: Array<ICollegialBody> = [];

    @Input()
    formGroup;

    constructor() {
    }

    ngOnInit() {
    }

}
