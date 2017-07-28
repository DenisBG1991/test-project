import {Injectable} from '@angular/core';
import {LocaleService, TranslationService} from 'angular-l10n';
import {FormGroup, FormBuilder, AbstractControl, ValidatorFn} from '@angular/forms';
import {FormValidationException} from '@app/services/api/validation.error';

/**
 * Правила валидации отдельно взятого свойства модели.
 */
interface IPropertyValidation<TModel> {
    propExpression: (model: TModel) => any;
    validators: any[];
}

/**
 * Сервис валидации. Stateless. Содержит helper-функции для валидации:
 * # фабрику FormGroup,
 * # функцию для фиксации серверных ошибок в FormGroup,
 * # политику показа валидационных сообщений,
 * # фукнцию получения локализованных текстов валидационных сообщений.
 */
@Injectable()
export class ValidationService {

    constructor(private formBuilder: FormBuilder,
                private translation: TranslationService,
                private locale: LocaleService) {

    }

    /**
     * Определяет политику отображения валидационных сообщений контрола формы.
     * @param formGroup
     * @param controlKey
     */
    showControlErrors(formGroup: FormGroup, controlKey: string): boolean {
        const control = formGroup.controls[controlKey];
        return control && control.errors && control.touched;
    }

    /**
     * Определяет политику отображения валидационных сообщений формы.
     * @param formGroup
     */
    showFormErrors(formGroup: FormGroup): boolean {
        return formGroup.errors != null;
    }

    /**
     * Возвращает локализованные сообщения об ошибках по контролу формы.
     * @param formGroup
     * @param controlKey
     * @param translationKey Ключ переводов формы (например, 'loginForm').
     */
    getControlErrorMessages(formGroup: FormGroup, controlKey: string, translationKey: string): string[] {
        const errorMessages: string[] = [];

        const control = formGroup.controls[controlKey];
        if (!control) {
            return null;
        }

        const controlErrors = formGroup.controls[controlKey].errors;
        if (!controlErrors) {
            return [];
        }

        for (const errorKey in controlErrors) {
            if (errorKey === 'server') { // серверные ошибки в форме уже локализованы сервером
                return [<string>controlErrors[errorKey]]; // серверные ошибки приоритетнее клиентски
            } else { // остальные (клиентские) требуют локализации
                const errorMessageTranslated = this.translation
                    .translate(`${translationKey}.validation.${controlKey}.${errorKey}`);
                errorMessages.push(errorMessageTranslated);
            }
        }

        return errorMessages;
    }

    /**
     * Возвращает локализованные сообщения об ошибках по форме.
     * @param formGroup
     */
    getFormErrorMessages(formGroup: FormGroup): string[] {
        if (!formGroup.errors) {
            return null;
        }

        return [formGroup.errors['server']];
    }

    /**
     * Регистрирует ошибки, добавляя их в formGroup. Служит для регистраии серверных ошибок при вызове API (в onError-делегате Observable).
     *
     * Серверные ошибки валидации приходят в формате
     * {
     *      errors: [
     *          {
     *              key: "username", // ошибка по контролу "username"
     *              message: "<message>" // локализованное сообщение об ошибке
     *          },
     *          {
     *              key: "", // ошибка по форме, не привязанная к какому-либо контролу
     *              message: "<message>" // локализованное сообщение об ошибке
     *          }
     *      ]
     * }
     *
     * Данный метод регистрирует их в FormGroup, добавляя их с ключом "server", после чего formGroup преобретает вид
     * {
     *      errors: { // ошибки уровня формы, не привязанные к какому-либо контролу
     *          server: "<message>" // серверная ошибка, message присутствует прямо здесь, сервер возвращает его локализованным
     *      },
     *      controls: [
     *          {
     *              errors: {
     *                  required: true, // клиентская ошибка валидатора, сам message находится в ресурсах
     *                  server: "<message>" // серверная ошибка, message присутствует прямо здесь, сервер возвращает его локализованным
     *              }
     *          }
     *      ]
     * }
     * @param formGroup
     * @param e
     */
    registerErrors(formGroup: FormGroup, e: FormValidationException) {

        if (!e.errors) {
            return;
        }

        for (const error of e.errors) {

            // парсим ошибки
            const formControl = formGroup.controls[error.key];

            if (formControl) { // ошибка привязана к форм-контролу
                // добавляем ошибку в словарь ошибок formControl с ключом "server"
                const controlErrors = formControl.errors || {};
                controlErrors['server'] = error.message;

                formControl.setErrors(controlErrors);
                formControl.markAsTouched(); // пользователь мог отправить форму, не трогая контрол
                // ошибки отображаются только для тронутых контролов
                // поэтому для отображения серверной ошибки нужно пометить контрол как touched
            } else {
                formGroup.setErrors({'server': error.message});
            }
        }
    };

    /**
     * Фабрика FormGroup. Позволяет создать FormGroup без необходимости строкового определения элементов формы (по property expression'ам).
     * @param formModel - модель FormGroup
     * @param validation - правила валидации элементов модели
     */
    createFormGroup<TModel>(formModel: TModel,
                            validation: IPropertyValidation<TModel>[] = null): FormGroup {

        // валидаторы, определённые клиентом
        const modelValidationConfig: { [formKey: string]: any; } = {};

        if (validation) {
            validation.forEach(v => {
                const propExpression = v.propExpression.toString();
                const propName = /\.([^\.;]+);?\s*\}$/.exec(propExpression)[1]; // парсит имя свойства из expression'а
                modelValidationConfig[propName] = v.validators;
            });
        }

        // конфигурация контролов формы
        // сюда необходимо добавить текущие значения модели и контролы, для которых не были явно определены валидаторы
        const formControlsConfig: { [formKey: string]: any; } = {};

        for (const member in formModel) {
            if (!formModel.hasOwnProperty(member)) {
                continue;
            }

            const memberValidators = modelValidationConfig[member];

            if (memberValidators) {
                formControlsConfig[member] = [formModel[member] || '', memberValidators];
            } else {
                formControlsConfig[member] = [formModel[member] || ''];
            }
        }

        return this.formBuilder.group(formControlsConfig);
    };

    /**
     * Custom'ная валидация. Required для multilingual контрола для текущего языка.
     */
    requiredMultilingual(): ValidatorFn {
        const culture = this.locale.getDefaultLocale();
        return (control: AbstractControl): { [key: string]: any } => {
            return this.isEmptyInputValue(control.value, culture) ? {'required': true} : null;
        };
    }

    private isEmptyInputValue(value: any, culture: string): boolean {
        if (!value || value.length === 0) {
            return true;
        }
        if (culture in value) {
            if (!value[culture] || value[culture].length === 0) {
                return true;
            }
            return false;
        }
        return true;
    };
}
