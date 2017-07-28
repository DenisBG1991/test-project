export class MultilingualText {
    translations: Translation[];

    /**
     * Парсит модель из словаря.
     * @param dictionary
     */
    static fromDictionary(dictionary: { [key: string]: string }): MultilingualText {

        if (dictionary == null) {
            return null;
        }

        let multilingualText = new MultilingualText();

        multilingualText.translations = [];
        for (let locale in dictionary) {
            if (dictionary.hasOwnProperty(locale)) {
                multilingualText.translations.push({
                    locale: locale,
                    value: dictionary[locale]
                });
            }
        }

        return multilingualText;
    }

    /**
     * Конвертирует модель в словарь. В словарь попадают только не пустые переводы.
     */
    toDictionary(): { [key: string]: string } {
        if (this.translations == null) {
            return null;
        }

        let dictionary: { [key: string]: string } = {};
        for (let translation of this.translations) {
            if (!!translation.value) {
                dictionary[translation.locale] = translation.value;
            }
        }

        return dictionary;
    }
}

export class Translation {
    locale: string;
    value: string;
}
