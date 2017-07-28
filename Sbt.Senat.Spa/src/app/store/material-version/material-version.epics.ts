import {Injectable} from '@angular/core';
import {MaterialVersionActions} from '@app/store/material-version/material-version.actions';
import {MaterialService} from '@app/services/api/material.service';
import {ErrorActions} from '@app/store/error/error.actions';
import {PersonActions} from '@app/store/person/person.actions';
import {Observable} from 'rxjs/Observable';
import 'rxjs/observable/concat';
import 'rxjs/observable/of';

@Injectable()
export class MaterialVersionEpics {

    constructor(private _materialService: MaterialService,
                private _materialVersionActions: MaterialVersionActions,
                private _personActions: PersonActions,
                private _errorActions: ErrorActions) {

    }

    loadVersions = action$ => action$
        .ofType(MaterialVersionActions.LoadVersions)
        .switchMap(action => this._materialService.getMaterialVersions(action.payload.material)
            .switchMap(result => {
                return Observable.concat(
                    Observable.of(this._personActions.loadPersonsComplete(result.persons)),
                    Observable.of(this._materialVersionActions.loadMaterialVersionsComplete(result.versions))
                );
            })
            .catch(error => Observable.of(this._errorActions.errorOccurred(error))));
}
