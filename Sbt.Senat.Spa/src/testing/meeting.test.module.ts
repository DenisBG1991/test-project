import { NgModule } from '@angular/core';
import { MeetingDto } from '@app/shared/api/client/reference/api.reference';
import { Response, ResponseOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

@NgModule()
export class MeetingTestModule {
    constructor(backend: MockBackend) {
        backend.connections.subscribe((connection: MockConnection) => {

            if (connection.request.url.includes('/api/Meetings')) {
                let mockResponseBody: MeetingDto = MeetingDto.fromJS({});

                let response = new ResponseOptions({ body: mockResponseBody.toJS(), status: 200 });
                connection.mockRespond(new Response(response));
            }
        });
    }
}
