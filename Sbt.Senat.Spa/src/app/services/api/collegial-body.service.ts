import {Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {ICollegialBody} from '@app/store/collegial-body/collegial-body.model';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {Observable} from 'rxjs/Observable';
import {CustomHttp} from '@app/services/api/http';

@Injectable()
export class CollegialBodyService extends ApiService {

    constructor(http: CustomHttp) {
        super(http);
    }

    getCollegialBodies(): Observable<Array<ICollegialBody>> {
        return this.http.get(`api/web/collegialBodies`, this.defaultRequestOptions)
            .map(response => {
                return <ICollegialBody[]>response.json().items;
            });
    }
}
