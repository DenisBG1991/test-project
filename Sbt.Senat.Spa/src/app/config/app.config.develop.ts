import { IAppConfig } from '@app/config';
import { AppConfigProvider } from '@app/config';

export const DevelopAppConfig: IAppConfig = {
    api: {
        baseUrl: ''
    },
    mobileApp: {
        downloadUrl: 'https://i-navigator.sbrf.ru/dimensys/list'
    }
};

AppConfigProvider.registerConfig('develop', DevelopAppConfig);
