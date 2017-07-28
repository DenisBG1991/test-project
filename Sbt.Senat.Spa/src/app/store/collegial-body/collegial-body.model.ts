import {ICompanyRef} from '@app/store/company/company.model';
import {IHoldingRef} from '@app/store/holding/holding.model';
export interface ICollegialBody extends ICollegialBodyRef {
    name: string;
    company: ICompanyRef;
    holding: IHoldingRef;
}

export interface ICollegialBodyRef {
    id: string;
}
