import {Injectable} from '@angular/core';
import {LocaleService, TranslationService} from 'angular-l10n';
import * as moment from 'moment';
@Injectable()
export class LocalizationConfig {

    constructor(public locale: LocaleService, public translation: TranslationService) {
    }

    load(): Promise<any> {
        this.locale.addConfiguration()
            .addLanguages(['ru', 'en'])
            .setCookieExpiration(30)
            .defineDefaultLocale('ru', 'RU')
            .defineCurrency('RUB');

        this.locale.init();


        this.translation.addConfiguration()
            .addProvider('./assets/lang/locale-');

        const promise: Promise<any> = new Promise((resolve: any) => {
            this.translation.translationChanged.subscribe(() => {
                moment.locale(this.translation.getLanguage());
                resolve(true);
            });
        });

        this.translation.init();

        return promise;
    }
}


export function initLocalization(localizationConfig: LocalizationConfig): Function {
    return () => localizationConfig.load();
}
