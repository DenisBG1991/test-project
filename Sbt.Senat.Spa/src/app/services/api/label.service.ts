import {Injectable} from '@angular/core';
import {ILabel} from '@app/store/label';
import {Observable} from 'rxjs/Observable';
import {ApiService} from '@app/services/api/api.service';
import {CustomHttp} from '@app/services/api/http';

@Injectable()
export class LabelService extends ApiService {
    constructor(http: CustomHttp) {
        super(http);
    }

    /**
     * Создаёт новый тэг.
     * @param name Имя нового тэга.
     */
    createLabel(name: string): Observable<ILabel> {
        return this.http.post('/api/Labels', {
            name: name
        }, this.defaultRequestOptions).map(response => {
            const label = response.json();
            return {
                id: label.id,
                name: label.name
            };
        });
    }

    /**
     * Ищет тэги по имени.
     * @param query Строка поиска.
     */
    findLabels(query: string): Observable<ILabel[]> {
        return this.http.get('/api/Labels'
            + `?query=${query}`
            + '&page=1'
            + '&size=10', this.defaultRequestOptions
        ).map(response => {
            const labels = response.json().items.map(dto => {
                return {
                    id: dto.id,
                    name: dto.name
                };
            });
            return labels;
        });
    }
}
