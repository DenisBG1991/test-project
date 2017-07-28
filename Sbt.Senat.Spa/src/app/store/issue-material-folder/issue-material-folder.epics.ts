import {Injectable} from '@angular/core';
import {IssueMaterialFolderActions} from '@app/store/issue-material-folder/issue-material-folder.actions';
import {MaterialService} from '@app/services/api/material.service';
import {PersonActions} from '@app/store/person/person.actions';
import {ErrorActions} from '@app/store/error/error.actions';
import {MaterialVersionActions} from '@app/store/material-version/material-version.actions';
import {IssueMaterialActions} from '@app/store/issue-material/issue-material.actions';
import {Observable} from 'rxjs/Observable';
import 'rxjs/observable/concat';
import 'rxjs/observable/of';

@Injectable()
export class IssueMaterialFolderEpics {
    constructor(private _materialService: MaterialService,
                private _folderActions: IssueMaterialFolderActions,
                private _personActions: PersonActions,
                private _issueMaterialActions: IssueMaterialActions,
                private _materialVersionActions: MaterialVersionActions,
                private _errorActions: ErrorActions) {

    }

    loadFolder = action$ => action$
        .ofType(IssueMaterialFolderActions.LoadFolder)
        .switchMap(action => this._materialService.getIssueMaterialsFolder(action.payload.issue, action.payload.location)
            .switchMap(result => {
                return Observable.concat(
                    Observable.of(this._personActions.loadPersonsComplete(result.persons)),
                    Observable.of(this._materialVersionActions.loadMaterialVersionsComplete(result.versions)),
                    Observable.of(this._folderActions.loadFoldersComplete(result.folders)),
                    Observable.of(this._issueMaterialActions.loadMaterialsComplete(result.materials))
                );
            })
            .catch(error => Observable.of(this._errorActions.errorOccurred(error))));
}
