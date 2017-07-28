/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ValidationService } from './validation.service';
import { CommonTestModule } from '@test/common.test.module';

describe('Service: Validation', () => {
  beforeEach(() => {
      TestBed.configureTestingModule({
          imports: [CommonTestModule],
          providers: []
    });
  });

  it('should ...', inject([ValidationService], (service: ValidationService) => {
    expect(service).toBeTruthy();
  }));
});
