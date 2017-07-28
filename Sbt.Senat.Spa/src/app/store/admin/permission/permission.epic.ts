import {Observable} from 'rxjs/Observable';
import 'rxjs/observable/concat';
import 'rxjs/observable/of';

import {ErrorActions} from '@app/store/error/error.actions';
import {Injectable} from '@angular/core';
import {PermissionService} from '@app/services/api/permission.service';
import {PermissionActions} from '@app/store/admin/permission/permission.actions';

@Injectable()
export class PermissionEpics {

    constructor(private _permissionService: PermissionService,
                private _permissionActions: PermissionActions,
                private _errorActions: ErrorActions) {

    }

    loadGroupPermissions = action$ => action$
        .ofType(PermissionActions.LoadGroupPermissions)
        .switchMap(action => this._permissionService.getGroupPermissions()
            .map(result => this._permissionActions.loadGroupPermissionsComplete(result))
            .catch(error => Observable.of(this._errorActions.errorOccurred(error))));

}
