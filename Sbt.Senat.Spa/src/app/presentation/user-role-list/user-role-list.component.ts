import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {IUserRole, IUserRoleRef} from '@app/store/admin/user-role/user-role.model';
import {NgRedux} from '@angular-redux/store';
import IAdminState from '@app/store/admin/store.model';
import {UserRoleActions} from '@app/store/admin/user-role/user-role.actions';
import {PermissionLevelEnum} from '@app/store/permission/permission.model';
import {PermissionSelectors} from '@app/store/admin/permission/permission.selectors';
import {PermissionEnum} from '@app/store/permission';

@Component({
    selector: 'senat-user-role-list',
    templateUrl: './user-role-list.component.html',
    styleUrls: ['./user-role-list.component.css']
})
export class UserRoleListComponent implements OnInit {

    @Input()
    userId: string;
    @Input()
    permissionLevels: Array<PermissionLevelEnum>

    userRoles$: Observable<IUserRole[]> = this._ngRedux.select(x => x.userRoles.filter(u => u.userId === this.userId));

    canEdit$: Observable<boolean> = this._ngRedux.select(this._permissionSelectors.hasAnyPermissions([PermissionEnum.EditUserRole]));

    constructor(private _ngRedux: NgRedux<IAdminState>, private _userRoleActions: UserRoleActions, private _permissionSelectors: PermissionSelectors) {
    }

    ngOnInit() {
        this._ngRedux.dispatch(this._userRoleActions.loadUserRolePage({
            userId: this.userId,
            permissionLevels: this.permissionLevels
        }, {
            pageNum: 1,
            pageSize: 10000
        }));
    }

    deleteUserRole(userRole: IUserRoleRef) {
        if (!confirm('Удалить?')) {
            return;
        }
        this._ngRedux.dispatch(this._userRoleActions.deleteUserRole(userRole));
    }

}
