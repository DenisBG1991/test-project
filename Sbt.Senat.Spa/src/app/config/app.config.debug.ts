import { IAppConfig } from '@app/config';
import { AppConfigProvider } from '@app/config';

export const DebugAppConfig: IAppConfig = {
    api: {
        baseUrl: '' // префикс URL на sbt-osop-224
    },
    mobileApp: {
        downloadUrl: 'https://i-navigator.sbrf.ru/dimensys/list'
    }
};

AppConfigProvider.registerConfig('debug', DebugAppConfig);
