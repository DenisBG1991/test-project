import {Component, Input, OnInit} from '@angular/core';
import IAdminState from '@app/store/admin/store.model';
import {NgRedux} from '@angular-redux/store';
import {RoleActions} from '@app/store/admin/role/role.actions';
import {Observable} from 'rxjs/Observable';
import {IRole} from '@app/store/admin/role/role.model';
import {ICollegialBody} from '@app/store/collegial-body/collegial-body.model';
import {PermissionLevelEnum} from '@app/store/permission/permission.model';
import {CollegialBodyActions} from '@app/store/collegial-body/collegial-body.actions';
import {PermissionActions} from '@app/store/admin/permission/permission.actions';
import {UserRoleActions} from '@app/store/admin/user-role/user-role.actions';
import {PermissionSelectors} from '@app/store/admin/permission/permission.selectors';
import {PermissionEnum} from '@app/store/permission';
import {HoldingActions} from '@app/store/holding/holding.actions';
import {CompanyActions} from '@app/store/company/company.actions';
import {ICompany} from '@app/store/company/company.model';
import {IHolding} from '@app/store/holding/holding.model';

@Component({
    selector: 'senat-create-user-role',
    templateUrl: './create-user-role.component.html',
    styleUrls: ['./create-user-role.component.css']
})
export class CreateUserRoleComponent implements OnInit {

    @Input()
    userId: string;

    permissionLevels: Array<{
        value: PermissionLevelEnum,
        name: string
    }> = [{
        value: PermissionLevelEnum.Root,
        name: 'Основной'
    }, {
        value: PermissionLevelEnum.Holding,
        name: 'Структурная единица'
    }, {
        value: PermissionLevelEnum.Company,
        name: 'Компания'
    }, {
        value: PermissionLevelEnum.CollegialBody,
        name: 'Коллегиальный орган'
    }];

    pl = PermissionLevelEnum;

    userRole: FormModel = new FormModel();


    roles$: Observable<IRole[]> = this._ngRedux.select(x => x.roles.filter(f => f.permissionLevel.toString() === (this.userRole.permissionLevel || '').toString()));

    collegialBodies$: Observable<ICollegialBody[]> = this._ngRedux.select(this._permissionSelectors.collegialBodyPermissionFilter(PermissionEnum.EditUserRole))
        .map(list => list.filter(f => f.company.id === this.userRole.companyId));
    companies$: Observable<ICompany[]> = this._ngRedux.select(this._permissionSelectors.companyChildPermissionsFilter([PermissionEnum.EditUserRole]));
    holdings$: Observable<IHolding[]> = this._ngRedux.select(this._permissionSelectors.holdingChildPermissionsFilter([PermissionEnum.EditUserRole]));

    permissionLevels$: Observable<Array<{
        value: PermissionLevelEnum,
        name: string
    }>> = this._ngRedux.select(x => {
        const maxLevel: number = x.permissions.filter(pm => pm.permission === PermissionEnum.EditUserRole)
            .reduce((p, c, i, arr) => Math.max(p, <number>(c.permissionLevel.valueOf())), 0);
        if (maxLevel === 0) {
            return [];
        }
        return this.permissionLevels.filter(f => f.value.valueOf() >= maxLevel);
    });

    constructor(private _ngRedux: NgRedux<IAdminState>, private _roleActions: RoleActions,
                private _collegialBodyActions: CollegialBodyActions,
                private _userRoleActions: UserRoleActions,
                private _permissionSelectors: PermissionSelectors,
                private _holdingActions: HoldingActions,
                private _companyActions: CompanyActions) {
    }


    ngOnInit() {
        this._ngRedux.dispatch(this._roleActions.updateRoles());
        this._ngRedux.dispatch(this._collegialBodyActions.updateCollegialBodies());
        this._ngRedux.dispatch(this._holdingActions.updateHoldings());
        this._ngRedux.dispatch(this._companyActions.updateCompanies());
    }

    refresh() {
        this._ngRedux.dispatch(this._roleActions.ping());
        this._ngRedux.dispatch(this._companyActions.ping());
        this._ngRedux.dispatch(this._holdingActions.ping());
    }

    save() {
        this._ngRedux.dispatch(this._userRoleActions.createUserRole({
            userId: this.userId,
            collegialBody: {
                id: this.userRole.collegialBodyId
            },
            role: {
                id: this.userRole.roleId
            },
            holding: null,
            company: null
        }));
    }

}

class FormModel {
    roleId: string;
    holdingId: string;
    companyId: string;
    collegialBodyId: string;
    permissionLevel: PermissionLevelEnum
}
