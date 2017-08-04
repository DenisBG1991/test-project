import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { OrgUnit } from '@app/presentation/admin-menu/orgs-unit.model';

import { HttpUrlWrappingDecorator } from '@app/services/api/http-url-wrapping-decorator';

@Injectable()
export class LoadDataService {
    constructor(private http: HttpUrlWrappingDecorator) {};

    loadData(url, options): Observable<OrgUnit> {
        return this.http.get(url, options)
            .flatMap(data => data.json());
    };
}
