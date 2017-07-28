
import { NgModule } from '@angular/core';
import { UserDto, EmployeeDto } from '@app/shared/api/client/reference/api.reference';
import { Response, ResponseOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

@NgModule()
export class UserTestModule {
    constructor(backend: MockBackend) {
        backend.connections.subscribe((connection: MockConnection) => {

            if (connection.request.url.includes('/api/User')) {

                let mockResponseBody = new UserDto();
                mockResponseBody.id = '0971E0E5-1D9D-4E3D-A9CB-9790280CE756';
                mockResponseBody.username = 'tester';
                mockResponseBody.userId = 'C6A94AB5-648A-4095-A9DB-63C02E05E263';


                let response = new ResponseOptions({ body: mockResponseBody.toJS(), status: 200 });
                connection.mockRespond(new Response(response));
            } else if (connection.request.url.includes('api/Employees/0971E0E5-1D9D-4E3D-A9CB-9790280CE756')) {
                let mockResponseBody = new EmployeeDto();

                let response = new ResponseOptions({ body: mockResponseBody.toJS(), status: 200 });
                connection.mockRespond(new Response(response));
            }
        });
    }
}
