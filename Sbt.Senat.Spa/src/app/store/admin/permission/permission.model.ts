import {PermissionEnum} from '@app/store/permission';
import {PermissionLevelEnum} from '@app/store/permission/permission.model';
import {IHoldingRef} from '@app/store/holding/holding.model';
import {ICompanyRef} from '@app/store/company/company.model';
import {ICollegialBodyRef} from '@app/store/collegial-body/collegial-body.model';

export interface IPermission {
    holding: IHoldingRef,
    company: ICompanyRef,
    collegialBody: ICollegialBodyRef,
    permission: PermissionEnum,
    permissionLevel: PermissionLevelEnum
}

