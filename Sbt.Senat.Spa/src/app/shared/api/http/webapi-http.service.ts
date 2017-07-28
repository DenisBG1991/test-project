import {Injectable, Inject} from '@angular/core';
import {
    Http, RequestOptionsArgs, Response, BaseRequestOptions,
    Headers, URLSearchParams, QueryEncoder
} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {IAppConfig, AppConfigInjectionToken} from '@app/config';
import * as moment from 'moment';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/share';
/**
 * ������� ��� Http, ��������� �������
 */
@Injectable()
export class WebapiHttpService {


    private prefix: string;

    constructor(private http: Http, @Inject(AppConfigInjectionToken) protected config: IAppConfig) {
        this.prefix = config.api.baseUrl + (config.api.baseUrl.endsWith('/') ? '' : '/');
    }

    request(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.http.request(this.prefix + url, options);
    }

    /**
     * Performs a request with `get` http method.
     */
    get(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.wrapRequest(this.http.get(this.prefix + url, this.extendArgs(options)));
    }

    /**
     * Performs a request with `get` http method.
     */
    search(url: string, search?: any, options?: RequestOptionsArgs): Observable<Response> {
        options = this.extendArgs(options);
        options.search = this.toSearch(search);
        return this.wrapRequest(this.http.get(this.prefix + url, options));
    }

    /**
     * Performs a request with `post` http method.
     */
    post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        return this.wrapRequest(this.http.post(this.prefix + url, this.prepareBody(body), this.extendArgs(options)));
    }

    /**
     * Performs a request with `put` http method.
     */
    put(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        return this.wrapRequest(this.http.put(this.prefix + url, this.prepareBody(body), this.extendArgs(options)));
    }

    /**
     * Performs a request with `delete` http method.
     */
    delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.wrapRequest(this.http.delete(this.prefix + url, this.extendArgs(options)));
    }

    /**
     * Performs a request with `patch` http method.
     */
    patch(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        return this.wrapRequest(this.http.patch(this.prefix + url, this.prepareBody(body), this.extendArgs(options)));
    }

    /**
     * Performs a request with `head` http method.
     */
    head(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.wrapRequest(this.http.head(this.prefix + url, this.extendArgs(options)));
    }

    /**
     * Performs a request with `options` http method.
     */
    options(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.http.options(this.prefix + url, options);
    }

    private extendArgs(options: RequestOptionsArgs): RequestOptionsArgs {
        let opts: RequestOptionsArgs = options || new BaseRequestOptions();
        if (!opts.headers) {
            opts.headers = new Headers();
        }
        if (opts.withCredentials == null) {
            opts.withCredentials = true;
        }
        opts.headers.set('content-type', 'application/json');
        opts.headers.set('accept', 'application/json');
        return opts;
    }

    private prepareBody(body: any) {
        if (!body) {
            return body;
        }
        return body.toJSON
            ? body.toJSON()
            : JSON.stringify(body);
    }


    private wrapRequest(request: Observable<Response>): Observable<Response> {
        return request.catch((e, c) => {
            if (e.json) {
                throw e.json();
            }
            throw e;
        }).share();

    }

    private toSearch(obj: any): URLSearchParams {
        if (!obj || (typeof obj === 'string')) {
            return null;
        }
        let params: URLSearchParams = new URLSearchParams('', new GhQueryEncoder());

        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                let val = obj[key];
                if (val instanceof Array) {
                    val.forEach((v, i) => {
                        let childParams = this.toSearch(v);
                        if (!childParams) {
                            params.set(`${key}[${i}]`, v);
                            return;
                        }
                        childParams.paramsMap.forEach((values, ckey, map) => {
                            values.forEach(value => {
                                params.set(`${key}[${i}].${ckey}`, value);
                            });
                        });
                    });
                } else if (val instanceof Date) {
                    // params.set(key, new Date(val.getTime() - (val.getTimezoneOffset() * 60000)).toISOString());
                    let fDate = moment(val);
                    // ���� �� ������������, � ����� encodeURIComponent �������� ��������� �����������
                    params.set(key, fDate.format());
                } else if (typeof (val) === 'object') {
                    let childParams = this.toSearch(val);
                    if (childParams) {
                        childParams.paramsMap.forEach((values, ckey, map) => {
                            values.forEach(value => {
                                params.set(`${key}.${ckey}`, value);
                            });
                        });
                    }
                } else {
                    params.set(key, obj[key]);
                }
            }
        }
        return params;
    }
}

class GhQueryEncoder extends QueryEncoder {
    encodeKey(k: string): string {
        k = super.encodeKey(k);
        return k.replace(/\+/gi, '%2B');
    }

    encodeValue(v: string): string {
        v = super.encodeKey(v);
        return v.replace(/\+/gi, '%2B');
    }
}
