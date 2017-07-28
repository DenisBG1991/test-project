import {Injectable} from '@angular/core';
import {Action} from 'redux';
import {IHolding} from '@app/store/holding/holding.model';

@Injectable()
export class HoldingActions {
    static readonly Ping = 'HOLDINGS_PING';
    static readonly UpdateHoldings = 'UPDATE_HOLDINGS';
    static readonly UpdateHoldingsComplete = 'UPDATE_HOLDINGS_COMPLETE';
    static readonly UpdateHoldingsFail = 'UPDATE_HOLDINGS_FAIL';

    ping() {
        return {
            type: HoldingActions.Ping
        };
    }

    updateHoldings() {
        return {
            type: HoldingActions.UpdateHoldings
        };
    }

    updateHoldingsComplete(holdings: Array<IHolding>) {
        return {
            type: HoldingActions.UpdateHoldingsComplete,
            payload: {
                holdings: holdings
            }
        };
    }

    updateHoldingsFail(error: any) {
        return {
            type: HoldingActions.UpdateHoldingsFail,
            payload: {
                error: error
            }
        };
    }
}
