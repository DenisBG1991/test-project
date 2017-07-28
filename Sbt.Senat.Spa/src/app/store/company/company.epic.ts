import {CompanyService} from '@app/services/api/company.service';
import {CompanyActions} from '@app/store/company/company.actions';
import {ErrorActions} from '@app/store/error/error.actions';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
@Injectable()
export class CompanyEpics {

    constructor(private _companyService: CompanyService,
                private _companyActions: CompanyActions,
                private _errorActions: ErrorActions) {
    }

    loadCompanies = (action$) => action$
        .ofType(CompanyActions.UpdateCompanies)
        .switchMap(() => this._companyService.getCompanies()
            .map(page => this._companyActions.updateCompaniesComplete(page))
            .catch(error => Observable.concat(
                Observable.of(this._companyActions.updateCompaniesFail(error)),
                Observable.of(this._errorActions.errorOccurred(error))
            )));
}
