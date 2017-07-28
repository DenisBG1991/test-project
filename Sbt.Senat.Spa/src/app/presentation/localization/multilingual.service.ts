import {Injectable} from '@angular/core';
import {LocaleService} from 'angular-l10n';

@Injectable()
export class MultilingualService {

    constructor(protected locale: LocaleService) {
    }

    getTranslation(dto: any, lang: string = null): string {
        if (!dto) {
            return undefined;
        }
        const culture = lang || this.locale.getDefaultLocale();
        if (dto[culture]) {
            return dto[culture];
        }
        for (const key in dto) {
            if (dto.hasOwnProperty(key)) {
                return dto[key];
            }
        }
    }
}
