import { IAppConfig } from '@app/config';
import { AppConfigProvider } from '@app/config';

export const LocalAppConfig: IAppConfig = {
    api: {
        baseUrl: 'http://localhost:60910'
    },
    mobileApp: {
        downloadUrl: 'https://i-navigator.sbrf.ru/dimensys/list'
    }
};

AppConfigProvider.registerConfig('local', LocalAppConfig);
