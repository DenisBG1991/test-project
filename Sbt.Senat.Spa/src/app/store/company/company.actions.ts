import {Injectable} from '@angular/core';
import {ICompany} from '@app/store/company/company.model';
import {Action} from 'redux';
import {IPage} from '@app/store/paging.model';
@Injectable()
export class CompanyActions {
    static readonly Ping = 'COMPANIES_PING';
    static readonly UpdateCompanies = 'UPDATE_COMPANIES';
    static readonly UpdateCompaniesComplete = 'UPDATE_COMPANIES_COMPLETE';
    static readonly UpdateCompaniesFail = 'UPDATE_COMPANIES_FAIL';

    ping() {
        return {
            type: CompanyActions.Ping
        };
    }
    
    updateCompanies() {
        return {
            type: CompanyActions.UpdateCompanies
        };
    }

    updateCompaniesComplete(page: IPage<ICompany>) {
        return {
            type: CompanyActions.UpdateCompaniesComplete,
            payload: {
                companies: page.items
            }
        };
    }

    updateCompaniesFail(error: any) {
        return {
            type: CompanyActions.UpdateCompaniesFail,
            payload: {
                error: error
            }
        };
    }
}
