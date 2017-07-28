/* tslint:disable:no-unused-variable */

import {TestBed, inject} from '@angular/core/testing';
import {MultilingualService} from './multilingual.service';
import {LocalizationModule} from 'angular-l10n';
import {HttpTestModule} from '@test/http.test.module';

describe('MultilingualService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [LocalizationModule.forRoot(), HttpTestModule],
            providers: [MultilingualService]
        });
    });

    it('should ...', inject([MultilingualService], (service: MultilingualService) => {
        expect(service).toBeTruthy();
    }));
});
