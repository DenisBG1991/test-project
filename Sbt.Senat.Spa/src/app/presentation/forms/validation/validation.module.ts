import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ValidationService} from '@app/services/validation.service';
import {ValidationDirective} from '@app/presentation/forms/validation/validation.directive';
import {ValidationMessageComponent} from '@app/presentation/forms/validation/validation-message/validation-message.component';

@NgModule({
    declarations: [
        ValidationDirective,
        ValidationMessageComponent
    ],
    entryComponents: [
        ValidationMessageComponent
    ],
    exports: [
        ValidationDirective,
        ValidationMessageComponent
    ],
    imports: [
        FormsModule,
        CommonModule
    ],
    providers: [
        ValidationService
    ]
})
export class ValidationModule {

}
