import {Injectable} from '@angular/core';
import {PermissionEnum} from '@app/store/permission';
import {PermissionLevelEnum} from '@app/store/permission/permission.model';
import {ICollegialBody} from '@app/store/collegial-body/collegial-body.model';
import IAdminState from '@app/store/admin/store.model';
import {ICompany} from '@app/store/company/company.model';
import {IHolding} from '@app/store/holding/holding.model';
@Injectable()
export class PermissionSelectors {

    hasAnyPermissions(permissions: PermissionEnum[]): (state: IAdminState) => boolean {
        return x => x.permissions.some(p => permissions.some(s => s === p.permission));
    }

    collegialBodyChildPermissionsFilter(permissions: PermissionEnum[]): (state: IAdminState) => ICollegialBody[] {
        return x => x.collegialBodies
            .filter(c => c.holding && x.permissions.some(p => permissions.some(s => s === p.permission)
            && (
                p.permissionLevel === PermissionLevelEnum.Root
                || (p.permissionLevel === PermissionLevelEnum.Holding && p.holding.id === c.holding.id )
                || (p.permissionLevel === PermissionLevelEnum.Company && p.company.id === c.company.id )
                || (p.permissionLevel >= PermissionLevelEnum.CollegialBody && p.collegialBody.id === c.id)
            )));
    }

    collegialBodyPermissionFilter(permission: PermissionEnum): (state: IAdminState) => ICollegialBody[] {
        return x => x.collegialBodies
            .filter(c => c.holding && x.permissions.some(p => p.permission === permission
            && (
                p.permissionLevel === PermissionLevelEnum.Root
                || (p.permissionLevel === PermissionLevelEnum.Holding && p.holding.id === c.holding.id )
                || (p.permissionLevel === PermissionLevelEnum.Company && p.company.id === c.company.id )
                || (p.permissionLevel === PermissionLevelEnum.CollegialBody && p.collegialBody.id === c.id)
            )));
    }


    companyChildPermissionsFilter(permissions: PermissionEnum[]): (state: IAdminState) => ICompany[] {
        return x => x.companies
            .filter(c => c.holding && x.permissions.some(p => permissions.some(s => s === p.permission)
            && (
                p.permissionLevel === PermissionLevelEnum.Root
                || (p.permissionLevel === PermissionLevelEnum.Holding && p.holding.id === c.holding.id )
                || (p.permissionLevel >= PermissionLevelEnum.Company && p.company.id === c.id)
            )));
    }

    holdingChildPermissionsFilter(permissions: PermissionEnum[]): (state: IAdminState) => IHolding[] {
        return x => x.holdings
            .filter(c => x.permissions.some(p => permissions.some(s => s === p.permission)
            && (
                p.permissionLevel === PermissionLevelEnum.Root
                || (p.permissionLevel >= PermissionLevelEnum.Holding && p.holding.id === c.id)
            )));
    }
}
