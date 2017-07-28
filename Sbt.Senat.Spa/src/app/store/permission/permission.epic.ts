import {Observable} from 'rxjs/Observable';
import 'rxjs/observable/concat';
import 'rxjs/observable/of';
import {PermissionActions} from '@app/store/permission/permission.actions';
import {ErrorActions} from '@app/store/error/error.actions';
import {Injectable} from '@angular/core';
import {PermissionService} from '@app/services/api/permission.service';

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

    addIssuePermissions = action$ => action$
        .ofType(PermissionActions.AddIssuePermissions)
        .switchMap(action => this._permissionService.getPermissions({
            meeting: null,
            issue: action.payload.issue
        })
            .map(result => this._permissionActions.addIssuePermissionsComplete(action.payload.issue, result))
            .catch(error => Observable.of(this._errorActions.errorOccurred(error))));

    addMeetingPermissions = action$ => action$
        .ofType(PermissionActions.AddMeetingPermissions)
        .switchMap(action => this._permissionService.getPermissions({
            meeting: action.payload.meeting,
            issue: null
        })
            .map(result => this._permissionActions.addMeetingPermissionsComplete(action.payload.meeting, result))
            .catch(error => Observable.of(this._errorActions.errorOccurred(error))));
}
