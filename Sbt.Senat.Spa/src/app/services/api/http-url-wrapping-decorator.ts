import {Http, RequestOptionsArgs, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {CustomHttp} from '@app/services/api/http';
import {Inject, Injectable} from '@angular/core';
import {AppConfigInjectionToken, IAppConfig} from '@app/config';

/**
 * Обёртка над Http, позволяющая добавлять baseUrl-префикс к запросам.
 * Таким образом запросы при необходимости могут выполняться как по абсолютному URL (если он задан в AppConfig'е),
 * так и по относительному.
 */
@Injectable()
export class HttpUrlWrappingDecorator extends CustomHttp {

    private _baseUrl: string;

    constructor(private _http: Http, @Inject(AppConfigInjectionToken) appConfig: IAppConfig) {
        super();

        this._baseUrl = appConfig.api.baseUrl;
    }

    /**
     * Performs a request with `get` http method.
     */
    get(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this._http.get(this.wrapUrl(url), options);
    }

    /**
     * Performs a request with `post` http method.
     */
    post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        return this._http.post(this.wrapUrl(url), body, options);
    }

    /**
     * Performs a request with `put` http method.
     */
    put(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        return this._http.put(this.wrapUrl(url), body, options);
    }

    /**
     * Performs a request with `delete` http method.
     */
    delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this._http.delete(this.wrapUrl(url), options);
    }

    protected wrapUrl(url: string): string {
        return this._baseUrl === ''
            ? url
            : `${this._baseUrl}/${url}`;
    }
}
