import {IHoldingRef} from '@app/store/holding/holding.model';
export interface ICompany extends ICompanyRef {
    name: string,
    holding: IHoldingRef
}

export interface ICompanyRef {
    id: string
}
