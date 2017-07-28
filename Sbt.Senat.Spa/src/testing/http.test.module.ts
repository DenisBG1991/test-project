import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { WebapiHttpService } from '@app/shared/api/http/webapi-http.service';
import { LabelsClient } from '@app/shared/api/client/reference/api.reference';
import { Http, BaseRequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { AppConfigProvider } from '@app/config';


@NgModule({
    providers: [HttpModule, WebapiHttpService, LabelsClient, {
        provide: Http,
        useFactory: (backend: MockBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
        },
        deps: [MockBackend, BaseRequestOptions]
    }, MockBackend, BaseRequestOptions, AppConfigProvider]
})
export class HttpTestModule { }
