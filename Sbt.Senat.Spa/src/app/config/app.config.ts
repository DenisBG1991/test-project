import {IAppConfig} from '@app/config/app.config';
import {environment} from 'environments/environment';
import {InjectionToken} from '@angular/core';

export interface IAppConfig {
    api: {
        baseUrl: string
    };
    mobileApp: {
        downloadUrl: string;
    };
}


// Токен зависимости. Зависимости в ангуляре резолвятся по токенам.
// Каждый провайдер ассоциирован с определённым токеном и определяет, что будет зарезолвлено.
// При записи providers: [FooService] на самом деле происходит регистрация провайдера { provide: FooService, useClass: FooService }
// (provide определяет тот самый токен).
// Использовать интерфейсы в провайдере нельзя, так как запись { provide: IFooService, useClass: IFooService }
// будет означать "при запросе IFooService верни экземпляр IFooService, что само по себе уже не корректно.
// Более того, в JS интерфейсов, как таковых, не существует. Интерфейсы - это синтаксис TypeScript'а.
//
// Зарезолвить конфиг по интерфейсу становится не тривиальной задачей. Делаем так:
//
// 1. Используем глобальный экземпляр AppConfigProvider.
// Он может выступать в роли провайдера, но содержит дополнительный метод registerConfig(key: string, config: IAppConfig).
// Вызов этого метода регистрирует конфиг по ключю в словаре.
//
// 2. Используем метод registerConfig для каждой трансформации конфига (вызывается в соответствующих файлах).
//
// 3. Используем фабрику, которая в рантайме будет выбирать из этого словаря IAppConfig по значению environment.
//
// 4. Токен для провайдера тоже придётся создать явно, с помощью InjectionToken, т.к. имеем дело с интерфейсом.

export const AppConfigInjectionToken = new InjectionToken('app.config');

/**
 * Резолвит IAppConfig по имени environment'а (см. angular-cli.json).
 * IAppConfig'и регистрируются в соответствующих app.config.<name>.ts файлах.
 */
export const AppConfigProvider = {
    provide: AppConfigInjectionToken,
    useFactory: appConfigFactory,
    registerConfig: appConfigProviderRegisterConfig
};

/**
 * Глобальный словарь IAppConfig'ов. Ключ - имя environment'а.
 */
const configMap: { [key: string]: IAppConfig } = {};

/**
 * Возвращает экземпляр IAppConfig для текущего environment'а.
 * Соответствующий IAppConfig должен быть предварительно зарегистрирован в AppConfigProvider'е.
 * @returns {IAppConfig}
 */
export function appConfigFactory() {
    return configMap[environment.config];
}

/**
 * Регистрирует IAppConfig с заданным ключом в глобальном словаре конфигов.
 */
export function appConfigProviderRegisterConfig(key: string, config: IAppConfig) {
    configMap[key] = config;
}
