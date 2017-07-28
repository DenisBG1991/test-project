import {Component, Inject, Input, OnInit} from '@angular/core';
import {AppConfigInjectionToken, IAppConfig} from '@app/config';
import {IPerson} from '@app/store/person/person.model';

@Component({
    selector: 'senat-person-avatar',
    templateUrl: './person-avatar.component.html',
    styleUrls: ['./person-avatar.component.css']
})
export class PersonAvatarComponent implements OnInit {

    @Input()
    person: IPerson;

    @Input()
    size = 76;

    @Input()
    tooltip = ''

    @Input()
    placeholder = 'assets/avatar-placeholder.png';

    baseUrl: string;


    constructor(@Inject(AppConfigInjectionToken) appConfig: IAppConfig) {
        this.baseUrl = appConfig.api.baseUrl;
    }

    ngOnInit() {
    }
}
