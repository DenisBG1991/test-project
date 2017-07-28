import {Component, OnInit, Inject, ChangeDetectionStrategy, Input} from '@angular/core';
import {NgRedux} from '@angular-redux/store';
import {Observable} from 'rxjs/Observable';
import {AppConfigInjectionToken, IAppConfig} from '@app/config';
import {IMultilingualPerson} from '@app/store/admin/person/person.model';
import IAdminState from '@app/store/admin/store.model';
import {IPersonRef} from '@app/store/person/person.model';


@Component({
    selector: 'senat-person-details',
    templateUrl: './person-details.component.html',
    styleUrls: ['./person-details.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PersonDetailsComponent implements OnInit {

    @Input()
    person: IPersonRef;

    person$: Observable<IMultilingualPerson> =
        this._ngRedux.select(x => x.persons.find(p => p.id === this.person.id));


    constructor(@Inject(AppConfigInjectionToken) private appConfig: IAppConfig,
                private _ngRedux: NgRedux<IAdminState>) {
    }

    ngOnInit(): void {
    }
}
