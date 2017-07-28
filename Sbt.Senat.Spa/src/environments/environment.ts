﻿// Environment-настройки вкомпиливаются в приложение при построении.
// Кроме environment, в проекте используется IAppConfig, как более гибкая альтернатива.
// Environment smells (глобальные переменные, недоступность для DI).
// Все IAppConfig реализации остаются в приложении после сборки.
// Какая именно будет использоваться - определяется переменной окружения config
// Использовать, в основном, стараемся IAppConfig, наследование не возбраняется.
// В environment зашиваем чувствительные настройки,
// о которых другие окружения знать не должны (пользователи, открывшие консоль разработчика)

export const environment = {
    production: false,
    config: 'local' // по умолчанию angular-cli (ng serve) использует environment, указанный в angular-cli.json с ключом 'dev'
};