import {InjectionToken} from '@angular/core';
import {primengLocaleFactory} from '@app/presentation/localization/primeng-locale-factory';
import {LocaleService} from 'angular-l10n';

export const PrimengLocaleInjectionToken = new InjectionToken('primeng.locale');

export const PrimengLocaleProvider = {
    provide: PrimengLocaleInjectionToken,
    useFactory: primengLocaleFactory,
    deps: [
        LocaleService
    ]
};
