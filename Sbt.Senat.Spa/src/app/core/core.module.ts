import {ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';
import {HttpModule} from '@angular/http';
import {MultilingualService} from '@app/presentation/localization/multilingual.service';
import * as localization from 'angular-l10n';
import {AuthGuard} from '@app/services/guards/auth-guard';
import {AppConfigProvider} from '@app/config';
import {NgReduxModule} from '@angular-redux/store';
import {NgReduxRouterModule} from '@angular-redux/router';
import {CollegialBodyService} from '@app/services/api/collegial-body.service';
import {EmployeesClient, PermissionClient, WebapiHttpService} from '@app/shared/api';
import {PermissionService} from '@app/services/api/permission.service';
import {ValidationService} from '@app/services/validation.service';
import {PersonService} from '@app/services/api/person.service';
import {CustomHttp} from '@app/services/api/http';
import {HttpUrlWrappingDecorator} from '@app/services/api/http-url-wrapping-decorator';


@NgModule({
    imports: [
        HttpModule,
        NgReduxModule,
        NgReduxRouterModule
    ],
    exports: [],
    providers: [
        CollegialBodyService,
        EmployeesClient,
        PermissionService,
        PermissionClient,
        PersonService,
        ValidationService,
        WebapiHttpService
    ]
})
export class CoreModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: CoreModule,
            providers: [
                MultilingualService,
                localization.TranslationService,
                AppConfigProvider,
                {provide: CustomHttp, useClass: HttpUrlWrappingDecorator}
            ]
        };
    }

    constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
        if (parentModule) {
            throw new Error(
                'CoreModule is already loaded. Import it in the AppModule only');
        }
    }
}
