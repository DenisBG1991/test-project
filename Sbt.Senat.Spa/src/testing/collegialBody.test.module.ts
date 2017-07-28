
import { NgModule } from '@angular/core';
import { CollegialBodyDetailsLocalizedDto } from '@app/shared/api';
import { Response, ResponseOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

@NgModule()
export class CollegialBodyTestModule {
    constructor(backend: MockBackend) {
        backend.connections.subscribe((connection: MockConnection) => {

            if (connection.request.url.includes('/api/CollegialBodies')) {

                let mockResponseBody: CollegialBodyDetailsLocalizedDto = CollegialBodyDetailsLocalizedDto.fromJS({
                    items: [{
                        id: 'A4BDF7B4-C659-44BC-A36C-4EDE0F47898E',
                        name: 'testCollegialBodyName'
                    }],
                    paging: { number: 1, size: 1, total: 1 }

                });

                let response = new ResponseOptions({ body: mockResponseBody.toJS(), status: 200 });
                connection.mockRespond(new Response(response));
            }
        });
    }
}
