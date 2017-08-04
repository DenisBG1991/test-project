import {Injectable} from '@angular/core';
import {MaterialService} from '@app/services/api/material.service';
import {PersonActions} from '@app/store/person/person.actions';
import {ErrorActions} from '@app/store/error/error.actions';
import {MaterialVersionActions} from '@app/store/material-version/material-version.actions';
import {Observable} from 'rxjs/Observable';
import 'rxjs/observable/concat';
import 'rxjs/observable/of';
import {AgendaItemMaterialFolderActions} from '@app/store/agenda-item-material-folder/agenda-item-material-folder.actions';
import {AgendaItemMaterialActions} from '@app/store/agenda-item-material/agenda-item-material.actions';

@Injectable()
export class AgendaItemMaterialFolderEpics {
    constructor(private _materialService: MaterialService,
                private _folderActions: AgendaItemMaterialFolderActions,
                private _personActions: PersonActions,
                private _materialActions: AgendaItemMaterialActions,
                private _materialVersionActions: MaterialVersionActions,
                private _errorActions: ErrorActions) {

    }

    loadFolder = action$ => action$
        .ofType(AgendaItemMaterialFolderActions.LoadFolder)
        .switchMap(action => this._materialService.getAgendaItemMaterialsFolder(
            action.payload.agendaItem,
            action.payload.location)
            .switchMap(result => {
                return Observable.concat(
                    Observable.of(this._personActions.loadPersonsComplete(result.persons)),
                    Observable.of(this._materialVersionActions.loadMaterialVersionsComplete(result.versions)),
                    Observable.of(this._folderActions.loadFoldersComplete(result.folders)),
                    Observable.of(this._materialActions.loadMaterialsComplete(result.materials))
                );
            })
            .catch(error => Observable.of(this._errorActions.errorOccurred(error))));
}
