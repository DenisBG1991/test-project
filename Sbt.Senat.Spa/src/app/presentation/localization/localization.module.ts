import {APP_INITIALIZER, NgModule} from '@angular/core';
import {initLocalization, LocalizationConfig} from '@app/presentation/localization/localization-config';
import {MultilingualPipe} from '@app/presentation/localization/multilingual.pipe';
import {MultilingualService} from '@app/presentation/localization/multilingual.service';
import * as localization from 'angular-l10n';

@NgModule({
    declarations: [
        MultilingualPipe
    ],
    exports: [
        MultilingualPipe,
        localization.TranslatePipe,
        localization.LocalizationModule
    ],
    imports: [
        localization.LocalizationModule
    ],
    providers: [
        MultilingualService,
        localization.TranslationService
    ]
})
export class LocalizationModule {

}
