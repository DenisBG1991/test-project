import {ICompany} from '@app/store/company/company.model';

import {CompanyActions} from '@app/store/company/company.actions';
import {IHolding} from '@app/store/holding/holding.model';
import {HoldingActions} from '@app/store/holding/holding.actions';
export function holdingReducer(state: Array<IHolding> = [], action): Array<IHolding> {
    switch (action.type) {
        case HoldingActions.Ping:
            return state.concat([]);
        case HoldingActions.UpdateHoldingsComplete:
            return action.payload.holdings;
        default:
            return state;
    }
}

