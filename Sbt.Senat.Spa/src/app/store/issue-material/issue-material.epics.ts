import {Injectable} from '@angular/core';
import {MaterialService} from '@app/services/api/material.service';
import {PersonActions} from '@app/store/person/person.actions';
import {ErrorActions} from '@app/store/error/error.actions';
import {MaterialVersionActions} from '@app/store/material-version/material-version.actions';
import {IssueMaterialActions} from '@app/store/issue-material/issue-material.actions';
import {Observable} from 'rxjs/Observable';
import 'rxjs/observable/concat';
import 'rxjs/observable/of';
import 'rxjs/add/operator/mergeAll';
import 'rxjs/add/operator/sampleTime';
import 'rxjs/add/observable/from';

import {IIssueMaterialFolder} from '@app/store/issue-material-folder/issue-material-folder.model';
import {IIssueMaterial} from '@app/store/issue-material/issue-material.model';
import {IMaterialVersion} from '@app/store/material-version/material-version.model';
import {IPerson} from '@app/store/person/person.model';
import {IssueMaterialFolderActions} from '@app/store/issue-material-folder/issue-material-folder.actions';
import {IssueMaterial, MaterialVersion, Person} from '@app/services/api/mapping.types';

@Injectable()
export class IssueMaterialEpics {
    constructor(private _materialService: MaterialService,
                private _personActions: PersonActions,
                private _issueMaterialActions: IssueMaterialActions,
                private _materialVersionActions: MaterialVersionActions,
                private _folderActions: IssueMaterialFolderActions,
                private _errorActions: ErrorActions) {

    }

    uploadIssueMaterial = action$ => action$
        .ofType(IssueMaterialActions.UploadIssueMaterial)
        .flatMap(action => [this._materialService.uploadMaterial(action.payload.issue, action.payload.location, action.payload.file)]
            .map(m => Observable.merge(
                // одновременно работают 2 Observable - результат и прогресс
                // каждый выдает свои Action-ы
                // результат мержится
                Observable.merge(
                    m.progress$.first(), // не дожидаемся sampleTime, чтобы сразу отобразился прогресс
                    m.progress$.sampleTime(3000)).map(p =>
                    this._materialVersionActions.materialUploadProgress(
                        action.payload.location,
                        null,
                        action.payload.file,
                        p.progress)),

                m.result$.map(response => {
                    const materialsUploaded: Array<{ self: IIssueMaterial, currentVersion: IMaterialVersion, createdBy: IPerson }> =
                        response.map(dto => {

                            const issueMaterial = IssueMaterial.parse(dto);
                            issueMaterial.issue = {
                                id: action.payload.issue.id
                            };
                            return {
                                self: issueMaterial,
                                currentVersion: MaterialVersion.parse(Object.assign(dto.currentVersion, {id: dto.id})),
                                createdBy: Person.parse(dto.currentVersion.createdBy)
                            };
                        });

                    // если был загружен .zip-архив, он был распакован,
                    // нужно достать все каталоги
                    // не нужно руками ничего мёржить, всё сделает reducer каталогов, нужно просто передать ему список
                    const folders: Array<IIssueMaterialFolder> = materialsUploaded.map(x => x.self.location)
                        .filter(x => x !== '\\') // нам нужны все каталоги, кроме корневого
                        .reduce((result, current) => { // избавляемся от дубликатов
                            if (result.indexOf(current) === -1) {
                                result.push(current);
                            }
                            return result;
                        }, [])
                        .map(x => {
                            const segments = x.split('\\');
                            return {
                                issue: {
                                    id: action.payload.issue.id
                                },
                                name: segments[segments.length - 2],
                                // location'ы заканчиваются на '\', например \folder\,
                                // соответственно нам нужен предпоследний элемент (folder)
                                location: x
                            };
                        });


                    return Observable.concat(
                        Observable.of(this._materialVersionActions.materialUploadProgress(action.payload.location,
                            null, action.payload.file, -1)),
                        Observable.of(this._materialVersionActions.loadMaterialVersionsComplete(
                            materialsUploaded.map(x => x.currentVersion))),
                        Observable.of(this._issueMaterialActions.loadMaterialsComplete(materialsUploaded.map(x => x.self))),
                        Observable.of(this._folderActions.loadFoldersComplete(folders)),
                        Observable.of(this._personActions.loadPersonsComplete(materialsUploaded.map(x => x.createdBy))));


                }).mergeAll())
            )[0]
            .catch(error => Observable.of(this._errorActions.errorOccurred(error))));


    /**
     * Загрузка презентаций.
     */
    loadPresentations = action$ => action$
        .ofType(IssueMaterialActions.LoadPresentations)
        .switchMap(action => this._materialService.getIssuePresentations(action.payload.issue)
            .switchMap(result => {
                return Observable.concat(
                    Observable.of(this._personActions.loadPersonsComplete(result.persons)),
                    Observable.of(this._materialVersionActions.loadMaterialVersionsComplete(result.versions)),
                    Observable.of(this._issueMaterialActions.loadMaterialsComplete(result.materials))
                );
            })
            .catch(error => Observable.of(this._errorActions.errorOccurred(error))));

    /**
     * Загрузка проектов решения.
     */
    loadDecisionProjects = action$ => action$
        .ofType(IssueMaterialActions.LoadDecisionProjects)
        .switchMap(action => this._materialService.getIssueDecisionProjects(action.payload.issue)
            .switchMap(result => {
                return Observable.concat(
                    Observable.of(this._personActions.loadPersonsComplete(result.persons)),
                    Observable.of(this._materialVersionActions.loadMaterialVersionsComplete(result.versions)),
                    Observable.of(this._issueMaterialActions.loadMaterialsComplete(result.materials))
                );
            })
            .catch(error => Observable.of(this._errorActions.errorOccurred(error))));

    /**
     * Изменение типа материала.
     */
    changeMaterialType = (action$) => action$
        .ofType(IssueMaterialActions.ChangeMaterialType)
        .flatMap(action => this._materialService.changeMaterialType(action.payload.material, action.payload.type)
            .map(() => this._issueMaterialActions.materialTypeChanged(action.payload.material, action.payload.type))
            .catch(error => Observable.of(this._errorActions.errorOccurred(error))));

    /**
     * Удаление материала.
     */
    deleteMaterial = action$ => action$
        .ofType(IssueMaterialActions.DeleteMaterial)
        .flatMap(action => this._materialService.deleteMaterial(action.payload.material)
            .map(() => { // эпик обязательно должен вернуть экшн
                return {
                    type: 'PING'
                };
            })
            .catch(error => {
                // оптимистичный сценарий - сначала удаляем материал (reducer удаляет его в ответ на DeleteMaterial),
                // а в случае ошибки восстанавливаем его с помощью loadMaterialsComplete
                return Observable.concat(
                    Observable.of(this._errorActions.errorOccurred(error)),
                    Observable.of(this._issueMaterialActions.loadMaterialsComplete(action.payload.material))
                );
            }));
}
