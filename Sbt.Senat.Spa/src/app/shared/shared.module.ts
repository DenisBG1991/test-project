import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpModule} from '@angular/http';
import * as localization from 'angular-l10n';
import {MultilingualPipe} from '@app/presentation/localization/multilingual.pipe';
import {PipesModule} from '@app/presentation/pipes/pipes.module';
import {AutoCompleteModule, CalendarModule, ConfirmDialogModule, GrowlModule} from 'primeng/primeng';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ValidationModule} from '@app/presentation/forms/validation/validation.module';
import {MultilingualTextInputComponent} from '@app/presentation/ui-kit/text-input/multilingual-text-input/multilingual-text-input.component';
import {MaterialButtonComponent} from '@app/presentation/material-button/material-button.component';
import {PersonPickerComponent} from '@app/presentation/ui-kit/person-picker/person-picker.component';
import {TextInputWithIconComponent} from '@app/presentation/ui-kit/text-input/text-input-with-icon/text-input-with-icon.component';
import {PersonAvatarComponent} from '@app/presentation/ui-kit/person-avatar/person-avatar.component';
import {HighlightTextComponent} from '@app/presentation/ui-kit/highlight-text/highlight-text.component';
import {ButtonComponent} from '@app/presentation/ui-kit/button/button.component';
import {TextInputComponent} from '@app/presentation/ui-kit/text-input/text-input.component';
import {TextareaComponent} from '@app/presentation/ui-kit/text-input/textarea/textarea.component';
import {CloseButtonComponent} from '@app/presentation/ui-kit/button/close-button/close-button.component';
import {CollegialBodyPickerComponent} from '@app/presentation/ui-kit/collegial-body-picker/collegial-body-picker.component';
import {LabelComponent} from '@app/presentation/ui-kit/label/label.component';
import {PopupComponent} from '@app/presentation/ui-kit/popup/popup.component';


@NgModule({
    declarations: [
        MultilingualPipe,
        MultilingualTextInputComponent,
        MaterialButtonComponent,
        PersonPickerComponent,
        TextInputWithIconComponent,
        PersonAvatarComponent,
        LabelComponent,
        HighlightTextComponent,
        ButtonComponent,
        CollegialBodyPickerComponent,
        TextInputComponent,
        TextareaComponent,
        CloseButtonComponent,
        PopupComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        localization.LocalizationModule,
        PipesModule
    ],
    exports: [
        CommonModule,
        HttpModule,
        MultilingualPipe,
        localization.TranslatePipe,
        PipesModule,
        CalendarModule,
        AutoCompleteModule,
        ConfirmDialogModule,
        GrowlModule,
        FormsModule,
        HttpModule,
        ReactiveFormsModule,
        MaterialButtonComponent,
        MultilingualTextInputComponent,
        ValidationModule,
        PersonPickerComponent,
        TextInputWithIconComponent,
        PersonAvatarComponent,
        LabelComponent,
        HighlightTextComponent,
        ButtonComponent,
        TextInputComponent,
        TextareaComponent,
        CloseButtonComponent,
        CollegialBodyPickerComponent,
        PopupComponent
    ],
    providers: []
})
export class SharedModule {
}
