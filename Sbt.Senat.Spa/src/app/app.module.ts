import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import * as localization from 'angular-l10n';

import { CoreModule } from '@app/core/core.module';

import { routingApp } from '@app/app.routing';

import { AppComponent } from '@app/app.component';

import { initLocalization, LocalizationConfig } from '@app/presentation/localization/localization-config';



@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        CoreModule.forRoot(),
        localization.LocalizationModule.forRoot(),
        routingApp
    ],
    providers: [
        {
            provide: LOCALE_ID,
            useValue: 'ru-RU'
        },
        LocalizationConfig,
        {
            provide: APP_INITIALIZER, // APP_INITIALIZER will execute the function when the app is initialized and delay what it provides.
            useFactory: initLocalization,
            deps: [LocalizationConfig],
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
