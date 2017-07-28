import {LocaleService} from 'angular-l10n';
import {IPrimengLocale} from '@app/presentation/localization/primeng-locale';

const primengLocaleMap: { [key: string]: IPrimengLocale } = {
    'ru': {
        dayNames: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
        dayNamesMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май',
            'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
        dayNamesShort: ['Воск', 'Пон', 'Вт', 'Ср', 'Четв', 'Пят', 'Суб'],
        monthNamesShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
        firstDayOfWeek: 1,
        dateFormat: 'dd.mm.yy'
    }
};

export function primengLocaleFactory(localeService: LocaleService): IPrimengLocale {
    return primengLocaleMap[localeService.getCurrentLanguage()];
}
