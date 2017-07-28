import {Injectable} from '@angular/core';
import {CollegialBodyService} from '@app/services/api/collegial-body.service';
import {CollegialBodyActions} from '@app/store/collegial-body/collegial-body.actions';
import {ErrorActions} from '@app/store/error/error.actions';
import {Observable} from 'rxjs/Observable';
import 'rxjs/observable/concat';
import 'rxjs/observable/of';
import {RoleActions} from '@app/store/admin/role/role.actions';
import {PermissionService} from '@app/services/api/permission.service';
import {UserRoleActions} from '@app/store/admin/user-role/user-role.actions';
import {UserService} from '@app/services/api/user.service';

@Injectable()
export class UserRoleEpics {

    constructor(private _permissionService: PermissionService,
                private _userRoleActions: UserRoleActions,
                private _errorActions: ErrorActions) {
    }

    createUserRole = (action$) => action$
        .ofType(UserRoleActions.CreateUserRole)
        .switchMap(action => this._permissionService.createUserRole({
            userId: action.payload.userRole.userId,
            role: action.payload.userRole.role,
            collegialBody: action.payload.userRole.collegialBody,
            company: action.payload.userRole.company,
            holding: action.payload.userRole.holding

        })
            .map(roles => this._userRoleActions.createUserRoleComplete(roles))
            .catch(error => Observable.concat(
                Observable.of(this._userRoleActions.createUserRoleFail(error)),
                Observable.of(this._errorActions.errorOccurred(error))
            )));

    loadUserRolePage = (action$) => action$
        .ofType(UserRoleActions.LoadUserRolePage)
        .switchMap(action => this._permissionService.getUserRoles(action.payload.filter, action.payload.paging)
            .map(page => this._userRoleActions.loadUserRolePageComplete(page))
            .catch(error => Observable.concat(
                Observable.of(this._userRoleActions.loadUserRolePageFail(error)),
                Observable.of(this._errorActions.errorOccurred(error))
            )));

    deleteUserRole = (action$) => action$
        .ofType(UserRoleActions.DeleteUserRole)
        .switchMap(action => this._permissionService.deleteUserRole(action.payload.userRole)
            .map(() => this._userRoleActions.deleteUserRoleComplete(action.payload.userRole))
            .catch(error => Observable.concat(
                Observable.of(this._userRoleActions.deleteUserRoleFail(error)),
                Observable.of(this._errorActions.errorOccurred(error))
            )));
}
