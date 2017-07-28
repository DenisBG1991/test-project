/* tslint:disable:no-unused-variable */

import {TestBed, async, inject, ComponentFixture} from '@angular/core/testing';
import {HttpModule} from '@angular/http';
import {ReactiveFormsModule, FormBuilder, Validators} from '@angular/forms';
import {ValidationMessageComponent} from './validation-message.component';
import {ValidationService} from '@app/services/validation.service';
import {LocalizationModule} from 'angular-l10n';

describe('Component: ValidationMessage', () => {

    let fixture: ComponentFixture<ValidationMessageComponent>;
    let component: ValidationMessageComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule,
                LocalizationModule.forRoot(),
                HttpModule],
            providers: [ValidationService],
            declarations: [ValidationMessageComponent]
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ValidationMessageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create an instance', inject([FormBuilder], (formBuilder: FormBuilder) => {

        component.formGroup = formBuilder.group({
            'username': [Validators.required]
        });
        component.formControlName = 'username';
        component.translationsKey = 'login';


        expect(component).toBeTruthy();
    }));
});
