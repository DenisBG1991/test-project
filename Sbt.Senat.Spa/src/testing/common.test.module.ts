import {NgModule} from '@angular/core';

import {MockBackend} from '@angular/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {Http, BaseRequestOptions} from '@angular/http';

import {UserTestModule} from '@test/user.test.module';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
    exports: [
        RouterTestingModule
    ],
    imports: [
        RouterTestingModule.withRoutes([]),
        UserTestModule,
        NoopAnimationsModule
    ],
    declarations: [],
    providers: [
        MockBackend,
        {
            provide: Http,
            useFactory: (backend: MockBackend, defaultOptions: BaseRequestOptions) => {
                return new Http(backend, defaultOptions);
            },
            deps: [MockBackend, BaseRequestOptions]
        }
    ]
})
export class CommonTestModule {
}
