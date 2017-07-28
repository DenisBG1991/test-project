import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {Translation} from './translation';
import {MultilingualText} from './multilingual-text';

@Component({
    selector: 'senat-multilingual-text-input',
    templateUrl: './multilingual-text-input.component.html',
    styleUrls: ['./multilingual-text-input.component.css'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => MultilingualTextInputComponent),
            multi: true
        }
    ]
})
export class MultilingualTextInputComponent implements OnInit, ControlValueAccessor {

    @Input()
    label: string = null;

    @Input()
    placeholder = '';

    @Input()
    multiline = true;

    localesSupported = ['ru-RU', 'de-DE', 'en-US'];

    model: MultilingualText;

    onChange = (_) => {};
    onTouched = () => {};

    constructor() {
        this.model = MultilingualText.fromDictionary({'ru-RU': ''});
    }

    ngOnInit() {

    }


    // модель компонента отличается от ngModel
    // модель компонента - это объект MultilingualText, модель контрола - dictionary<string, string>
    // контракт таков: ngModel != null когда есть хотя бы один перевод, отличный от пустой строки
    get value(): { [key: string]: string } {
        if (this.model.translations.find(x => x.value !== '')) {
            return this.model.toDictionary();
        }

        return null;
    }

    set value(value: { [key: string]: string }) {
        let model = MultilingualText.fromDictionary(value);
        if (model.translations.length === 0) {
            model = MultilingualText.fromDictionary({'ru-RU': ''});
        }

        this.model = model;
    }

    canAddTranslation(): boolean {
        return this.getFreeLocales().length > 0;
    }

    canRemoveTranslation(): boolean {
        return this.model.translations.length > 1;
    }

    addTranslation(): void {
        let locale = this.getFreeLocales()[0];
        this.model.translations.push({
            locale: locale,
            value: ''
        });

        this.onChange(this.value);
    }

    removeTranslation(translation: Translation): void {
        let index = this.model.translations.indexOf(translation);
        this.model.translations.splice(index, 1);

        this.onChange(this.value);
    }

    /**
     *  Возвращает свободные локали (отсутствующие в модели).
     */
    getFreeLocales(): Array<string> {
        return this.localesSupported.filter(x => this.model.translations.find(t => t.locale === x) == null);
    }

    /**
     *  Возвращает опции для выпадающего списка.
     */
    getOptions(currentTranslation: Translation): Array<string> {
        return this.getFreeLocales().concat([currentTranslation.locale]);
    }

    onKeyUp(): void {
        this.onChange(this.value);
    }


    writeValue(value: { [key: string]: string }) {
        this.value = value || {};
    }

    registerOnChange(fn) {
        this.onChange = fn;
    }

    registerOnTouched(fn) {
        this.onTouched = fn;
    }

    onBlur() {
        this.onTouched();
    }
}
