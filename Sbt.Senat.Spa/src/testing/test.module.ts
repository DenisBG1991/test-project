import {BrowserModule} from '@angular/platform-browser';

import {NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {WebapiHttpService} from '@app/shared/api/http/webapi-http.service';
import {LocalizationModule} from 'angular-l10n';
import {ActivatedRoute} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {
    AccountClient, UserClient, MeetingsClient, IssuesClient,
    LabelsClient, IssueMaterialsClient
} from '@app/shared/api/client/reference/api.reference';
import {CollegialBodiesClient, EmployeesClient} from '@app/shared/api/client/reference/api.reference';
import {Http, BaseRequestOptions} from '@angular/http';
import {MockBackend} from '@angular/http/testing';
import {AppConfigProvider} from '@app/config';
import {
    CalendarModule, Calendar, AutoCompleteModule, SharedModule, ButtonModule,
    MessagesModule, ProgressBarModule, ConfirmationService, ConfirmDialogModule
} from 'primeng/primeng';
import {SenatExpandableComponent} from '@app/presentation/senat-expandable/senat-expandable.component';

class MockActivatedRoute {
    params: any;

    constructor() {
        this.params = [];
    }
}

@NgModule({
    exports: [
        BrowserModule,
        LocalizationModule,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        Calendar,
        SharedModule, ButtonModule, ProgressBarModule, MessagesModule,
        ConfirmDialogModule,
        SenatExpandableComponent
    ],
    imports: [
        BrowserModule,
        RouterTestingModule,
        LocalizationModule.forRoot(),
        HttpModule,
        FormsModule,
        ReactiveFormsModule,
        CalendarModule,
        AutoCompleteModule,
        SharedModule, ButtonModule, MessagesModule, ProgressBarModule,
        ConfirmDialogModule
    ],
    declarations: [],
    providers: [
        WebapiHttpService,
        AppConfigProvider,
        {provide: ActivatedRoute, useClass: MockActivatedRoute},
        AccountClient, UserClient, CollegialBodiesClient, MeetingsClient, EmployeesClient,
        IssuesClient,
        IssueMaterialsClient,
        MockBackend,
        BaseRequestOptions,
        {
            provide: Http,
            useFactory: (backend: MockBackend, defaultOptions: BaseRequestOptions) => {
                return new Http(backend, defaultOptions);
            },
            deps: [MockBackend, BaseRequestOptions]
        },
        LabelsClient,
        ConfirmationService
    ]
})
export class TestModule {
}
