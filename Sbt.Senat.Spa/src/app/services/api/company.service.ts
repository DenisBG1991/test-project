import {Injectable} from '@angular/core';
import {CompaniesClient} from '@app/shared/api/client/reference/api.reference';
import {IPage} from '@app/store/paging.model';
import {Observable} from 'rxjs/Observable';
import {ICompany} from '@app/store/company/company.model';
@Injectable()
export class CompanyService {
    constructor(private _client: CompaniesClient) {
    }

    getCompanies(): Observable<IPage<ICompany>> {
        return this._client.getCompanies()
            .map(page => {
                const items = page.items.map(dto => {
                    const ret: ICompany = {
                        id: dto.id,
                        name: dto.name,
                        holding: {
                            id: dto.holding.id
                        }
                    };
                    return ret;

                });
                return {
                    pageNum: page.pageNum,
                    pageSize: page.pageSize,
                    items: items,
                    itemsTotal: page.itemsTotal
                };
            });
    }
}

