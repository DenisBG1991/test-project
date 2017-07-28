/* tslint:disable:no-unused-variable */
import { HttpModule } from '@angular/http';
import { TestBed, async, inject } from '@angular/core/testing';
import { WebapiHttpService } from './webapi-http.service';
import { AppConfigProvider } from '@app/config';

describe('Service: WebapiHttp', () => {
  beforeEach(() => {
      TestBed.configureTestingModule({
          imports: [HttpModule],
          providers: [WebapiHttpService, AppConfigProvider]
    });
  });

  it('should ...', inject([WebapiHttpService], (service: WebapiHttpService) => {
    expect(service).toBeTruthy();
  }));
});
