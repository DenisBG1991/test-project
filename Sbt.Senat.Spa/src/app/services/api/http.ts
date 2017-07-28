import {RequestOptionsArgs, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';

/**
 * По факту это интерфейс. Но DI ангуляра не умеет работать с интерфейсами.
 * Чтобы просто заинжектить интерфейс через конструктор, нужно сделать очень много извращений,
 * поэтому гораздо проще использовать абстрактный класс.
 */
export abstract class CustomHttp {
    /**
     * Performs a request with `get` http method.
     */
    abstract get(url: string, options?: RequestOptionsArgs): Observable<Response>;

    /**
     * Performs a request with `post` http method.
     */
    abstract post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response>;

    /**
     * Performs a request with `put` http method.
     */
    abstract put(url: string, body: any, options?: RequestOptionsArgs): Observable<Response>;

    /**
     * Performs a request with `delete` http method.
     */
    abstract delete(url: string, options?: RequestOptionsArgs): Observable<Response>;
}
