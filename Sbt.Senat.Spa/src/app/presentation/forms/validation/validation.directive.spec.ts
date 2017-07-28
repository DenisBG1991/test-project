/* tslint:disable:no-unused-variable */
import { TestModule } from '@test/test.module';
import { TestBed, async } from '@angular/core/testing';
import { ValidationDirective } from './validation.directive';

describe('Directive: SenatValidation', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TestModule],
            declarations: [
                ValidationDirective
            ],
            providers: [ValidationDirective]

        });
    });


});
