import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {AppConfigInjectionToken, IAppConfig} from '@app/config';


@Injectable()
export class UploadService {

    private prefix: string;

    constructor(@Inject(AppConfigInjectionToken) config: IAppConfig) {
        this.prefix = config.api.baseUrl + (config.api.baseUrl.endsWith('/') ? '' : '/');
    }

    upload(url: string, file: File): {
        progress$: Observable<Progress>,
        result$: Observable<any>
    } {
        const progress = new Subject<Progress>();
        const result = new Subject<any>();

        const formData = new FormData();

        formData.append(`attachment`, file, file.name);

        const xhr = new XMLHttpRequest();

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    progress.complete();
                    result.next(JSON.parse(xhr.response));
                    result.complete();
                } else {
                    result.error(xhr.response);
                }
            }
        };

        xhr.upload.onprogress = (ev: ProgressEvent): any => {
            progress.next({
                loaded: ev.loaded,
                total: ev.total,
                progress: Math.floor(ev.loaded * 100 / ev.total)
            });
        };

        xhr.withCredentials = true;
        xhr.open('POST', this.prefix + url, true);
        xhr.send(formData);

        return {
            progress$: progress.asObservable(),
            result$: result.asObservable()
        };
    }
}


export class Progress {
    readonly loaded: number;
    readonly total: number;
    readonly progress: number;
}
