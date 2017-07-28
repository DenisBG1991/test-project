import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {interval} from 'rxjs/observable/interval';
import {NgRedux} from '@angular-redux/store';
import IAdminState from '@app/store/admin/store.model';
import {PersonActions} from '@app/store/admin/person/person.actions';

@Component({
    selector: 'senat-person-details-form',
    templateUrl: './person-details-form.component.html',
    styleUrls: ['./person-details-form.component.css']
})
export class PersonDetailsFormComponent implements OnInit {

    @Input()
    formGroup: FormGroup;

    constructor() {
    }

    ngOnInit() {

    }

}
