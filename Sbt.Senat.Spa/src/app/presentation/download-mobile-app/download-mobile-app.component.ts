import {Component, Inject, OnInit} from '@angular/core';
import {AppConfigInjectionToken, IAppConfig} from '@app/config';

@Component({
    selector: 'senat-download-mobile-app',
    templateUrl: './download-mobile-app.component.html',
    styleUrls: ['./download-mobile-app.component.css']
})
export class DownloadMobileAppComponent implements OnInit {

    downloadUrl: string;

    constructor(@Inject(AppConfigInjectionToken) appConfig: IAppConfig) {
        this.downloadUrl = appConfig.mobileApp.downloadUrl;
    }

    ngOnInit() {
    }

}
