import {Injectable} from '@angular/core';
import {HoldingsClient} from '@app/shared/api/client/reference/api.reference';
import {IHolding} from '@app/store/holding/holding.model';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class HoldingService {
    constructor(private _client: HoldingsClient) {
    }

    getHoldings(): Observable<Array<IHolding>> {
        return this._client.getHoldings()
            .map(items => items.map(m => {
                const ret: IHolding = {
                    id: m.id,
                    name: m.name
                };
                return ret;
            }));
    }
}
