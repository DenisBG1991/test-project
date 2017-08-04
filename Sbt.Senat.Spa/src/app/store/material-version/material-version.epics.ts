import {Injectable} from '@angular/core';
import {MaterialVersionActions} from '@app/store/material-version/material-version.actions';
import {MaterialService} from '@app/services/api/material.service';
import {ErrorActions} from '@app/store/error/error.actions';
import {PersonActions} from '@app/store/person/person.actions';
import {Observable} from 'rxjs/Observable';
import 'rxjs/observable/concat';
import 'rxjs/observable/of';
import {MaterialVersion, Person} from '@app/services/api/mapping.types';

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

    uploadMaterialVersion = action$ => action$
        .ofType(MaterialVersionActions.UploadMaterialVersion)
        .flatMap(action => [this._materialService.uploadVersion(action.payload.material, action.payload.file)]
            .map(m => Observable.merge(
                Observable.merge(
                    m.progress$.first(), // не дожидаемся sampleTime, чтобы сразу отобразился прогресс
                    m.progress$.sampleTime(3000)).map(p =>
                    this._materialVersionActions.materialUploadProgress(null,
                        action.payload.material,
                        action.payload.file,
                        p.progress)),

                m.result$.map(response => {

                    const versionUploaded = MaterialVersion.parse(Object.assign(response, {id: action.payload.material.id}));
                    const createdBy = Person.parse(response.createdBy);

                    return Observable.concat(
                        Observable.of(this._materialVersionActions.materialUploadProgress(null,
                            action.payload.material,
                            action.payload.file, -1)),
                        Observable.of(this._materialVersionActions.loadMaterialVersionsComplete([versionUploaded])),
                        Observable.of(this._personActions.loadPersonsComplete([createdBy])));


                }).mergeAll())
            )[0]
            .catch(error => Observable.of(this._errorActions.errorOccurred(error))));
}
