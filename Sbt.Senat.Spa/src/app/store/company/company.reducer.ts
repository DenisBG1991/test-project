import {ICompany} from '@app/store/company/company.model';

import {CompanyActions} from '@app/store/company/company.actions';
export function companyReducer(state: Array<ICompany> = [], action): Array<ICompany> {
    switch (action.type) {
        case CompanyActions.Ping:
            return state.concat([]);
        case CompanyActions.UpdateCompaniesComplete:
            return action.payload.companies;
        default:
            return state;
    }
}

