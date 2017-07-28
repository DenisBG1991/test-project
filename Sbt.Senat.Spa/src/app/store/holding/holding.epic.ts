import {Injectable} from '@angular/core';
import {HoldingService} from '@app/services/api/holding.service';
import {HoldingActions} from '@app/store/holding/holding.actions';
import {ErrorActions} from '@app/store/error/error.actions';
import {Observable} from 'rxjs/Observable';
@Injectable()
export class HoldingEpics {

    constructor(private _holdingService: HoldingService,
                private _holdingActions: HoldingActions,
                private _errorActions: ErrorActions) {
    }

    loadHoldings = (action$) => action$
        .ofType(HoldingActions.UpdateHoldings)
        .switchMap(() => this._holdingService.getHoldings()
            .map(holdings => this._holdingActions.updateHoldingsComplete(holdings))
            .catch(error => Observable.concat(
                Observable.of(this._holdingActions.updateHoldingsFail(error)),
                Observable.of(this._errorActions.errorOccurred(error))
            )));
}
