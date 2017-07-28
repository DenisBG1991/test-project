import {Component, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {ValidationService} from '@app/services/validation.service';

@Component({
    selector: 'senat-validation-message',
    templateUrl: './validation-message.component.html',
    styleUrls: ['./validation-message.component.css']
})
export class ValidationMessageComponent implements OnInit {

    formGroup: FormGroup;
    formControlName: string;
    translationsKey: string;

    constructor(private validationService: ValidationService) {

    }

    ngOnInit() {

    }

    showControlErrors(): boolean {
        return this.validationService.showControlErrors(this.formGroup, this.formControlName);
    }

    getControlErrorMessages(): string[] {
        return this.validationService.getControlErrorMessages(this.formGroup, this.formControlName, this.translationsKey);
    }
}
