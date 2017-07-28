import {ChangeDetectionStrategy, Component, Inject, Input, OnInit} from '@angular/core';
import {IMaterialVersion} from '@app/store/material-version/material-version.model';
import {IPerson} from '@app/store/person/person.model';
import {AppConfigInjectionToken, IAppConfig} from '@app/config';

@Component({
    selector: 'senat-material-version',
    templateUrl: './material-version.component.html',
    styleUrls: ['./material-version.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MaterialVersionComponent implements OnInit {

    @Input()
    version: { self: IMaterialVersion, createdBy: IPerson };

    /**
     * Показывать текст "(текущая версия)"
     * @type {boolean}
     */
    @Input()
    isCurrent = false;

    private _baseUrl: string;

    /**
     * Формирует ссылку на скачивание файла.
     * @returns {string}
     */
    get downloadLink(): string {
        return `${this._baseUrl}/api/web/materials/${this.version.self.id}/versions/${this.version.self.num}`;
    }

    constructor(@Inject(AppConfigInjectionToken) appConfig: IAppConfig) {
        this._baseUrl = appConfig.api.baseUrl;
    }

    ngOnInit() {
    }
}
