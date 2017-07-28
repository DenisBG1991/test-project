import {BaseRequestOptions} from '@angular/http';
import {Injectable} from '@angular/core';
import * as moment from 'moment';
import {CustomHttp} from '@app/services/api/http';

@Injectable()
export class ApiService {
    protected defaultRequestOptions: BaseRequestOptions;

    constructor(protected http: CustomHttp) {

        this.defaultRequestOptions = new BaseRequestOptions();
        this.defaultRequestOptions.headers.set('content-type', 'application/json');
        this.defaultRequestOptions.headers.set('accept', 'application/json');
        this.defaultRequestOptions.withCredentials = true;
    }

    protected encodeDate(date: Date): string {
        if (!date) {
            return '';
        }

        return moment(date).format().replace(/\+/gi, '%2B'); // yyyy-MM-ddTHH:mm:ss.ttt+00:00
    }
}
