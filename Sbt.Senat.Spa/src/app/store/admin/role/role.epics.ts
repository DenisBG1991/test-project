import {Injectable} from '@angular/core';
import {CollegialBodyService} from '@app/services/api/collegial-body.service';
import {CollegialBodyActions} from '@app/store/collegial-body/collegial-body.actions';
import {ErrorActions} from '@app/store/error/error.actions';
import {Observable} from 'rxjs/Observable';
import 'rxjs/observable/concat';
import 'rxjs/observable/of';
import {RoleActions} from '@app/store/admin/role/role.actions';
import {PermissionService} from '@app/services/api/permission.service';

@Injectable()
export class RoleEpics {

    constructor(private _permissionService: PermissionService,
                private _roleActions: RoleActions,
                private _errorActions: ErrorActions) {
    }

    updateRoles = (action$) => action$
        .ofType(RoleActions.UpdateRoles)
        .switchMap(() => this._permissionService.getRoles()
            .map(roles => this._roleActions.updateRolesComplete(roles))
            .catch(error => Observable.concat(
                Observable.of(this._roleActions.updateRolesFail(error)),
                Observable.of(this._errorActions.errorOccurred(error))
            )));
}
