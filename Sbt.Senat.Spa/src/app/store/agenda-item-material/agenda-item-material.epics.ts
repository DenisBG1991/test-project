import {Injectable} from '@angular/core';
import {MaterialService} from '@app/services/api/material.service';
import {PersonActions} from '@app/store/person/person.actions';
import {ErrorActions} from '@app/store/error/error.actions';
import {MaterialVersionActions} from '@app/store/material-version/material-version.actions';

import {Observable} from 'rxjs/Observable';
import 'rxjs/observable/concat';
import 'rxjs/observable/of';
import 'rxjs/add/operator/mergeAll';
import 'rxjs/add/operator/sampleTime';
import 'rxjs/add/observable/from';

import {AgendaItemMaterialActions} from '@app/store/agenda-item-material/agenda-item-material.actions';
import {IAgendaItemMaterial} from '@app/store/agenda-item-material/agenda-item-material.model';
import {IMaterialVersion} from '@app/store/material-version/material-version.model';
import {IPerson} from '@app/store/person/person.model';
import {IAgendaItemMaterialFolder} from '@app/store/agenda-item-material-folder/agenda-item-material-folder.model';
import {AgendaItemMaterialFolderActions} from '@app/store/agenda-item-material-folder/agenda-item-material-folder.actions';
import {AgendaItemMaterial, AgendaItemMaterialFolder, MaterialVersion, Person} from '@app/services/api/mapping.types';

@Injectable()
export class AgendaItemMaterialEpics {
    constructor(private _materialService: MaterialService,
                private _personActions: PersonActions,
                private _agendaItemMaterialActions: AgendaItemMaterialActions,
                private _materialVersionActions: MaterialVersionActions,
                private _folderActions: AgendaItemMaterialFolderActions,
                private _errorActions: ErrorActions) {

    }


    /**
     * Загрузка презентаций.
     */
    loadPresentations = action$ => action$
        .ofType(AgendaItemMaterialActions.LoadPresentations)
        .switchMap(action => this._materialService.getAgendaItemPresentations(
            action.payload.agendaItem,
            action.payload.issue,
            action.payload.meeting)
            .switchMap(result => {
                return Observable.concat(
                    Observable.of(this._personActions.loadPersonsComplete(result.persons)),
                    Observable.of(this._materialVersionActions.loadMaterialVersionsComplete(result.versions)),
                    Observable.of(this._agendaItemMaterialActions.loadMaterialsComplete(result.materials))
                );
            })
            .catch(error => Observable.of(this._errorActions.errorOccurred(error))));

    /**
     * Загрузка проектов решения.
     */
    loadDecisionProjects = action$ => action$
        .ofType(AgendaItemMaterialActions.LoadDecisionProjects)
        .switchMap(action => this._materialService.getAgendaItemDecisionProjects(
            action.payload.agendaItem,
            action.payload.issue,
            action.payload.meeting)
            .switchMap(result => {
                return Observable.concat(
                    Observable.of(this._personActions.loadPersonsComplete(result.persons)),
                    Observable.of(this._materialVersionActions.loadMaterialVersionsComplete(result.versions)),
                    Observable.of(this._agendaItemMaterialActions.loadMaterialsComplete(result.materials))
                );
            })
            .catch(error => Observable.of(this._errorActions.errorOccurred(error))));

    /**
     * Изменение типа материала.
     */
    changeMaterialType = (action$) => action$
        .ofType(AgendaItemMaterialActions.ChangeMaterialType)
        .flatMap(action => this._materialService.changeMaterialType(
            action.payload.material,
            action.payload.type)
            .map(() => this._agendaItemMaterialActions.materialTypeChanged(
                action.payload.material,
                action.payload.type))
            .catch(error => Observable.of(this._errorActions.errorOccurred(error))));

    /**
     * Удаление материала.
     */
    deleteMaterial = action$ => action$
        .ofType(AgendaItemMaterialActions.DeleteMaterial)
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
                    Observable.of(this._agendaItemMaterialActions.loadMaterialsComplete(action.payload.material))
                );
            }));


    uploadAgendaItemMaterial = action$ => action$
        .ofType(AgendaItemMaterialActions.UploadMaterial)
        .flatMap(action => [this._materialService.uploadAgendItemMaterial(
            action.payload.agendaItem,
            action.payload.location,
            action.payload.file)]
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

                m.result$.map(contents => {

                    const folders = contents.filter(f => f.type === 'Folder')
                        .map(f => {
                            const folder = AgendaItemMaterialFolder.parse(f);
                            folder.agendaItem = {
                                id: action.payload.agendaItem.id
                            };
                            folder.location = action.payload.location + folder.name + '\\';
                            return folder;
                        });


                    const materials = contents.filter(f => f.type === 'Material')
                        .map(ms => {
                            const self = AgendaItemMaterial.parse(ms);

                            self.agendaItem = {
                                id: action.payload.agendaItem.id
                            };
                            self.location = action.payload.location;

                            const currentVersion = MaterialVersion.parse(ms.currentVersion);
                            currentVersion.id = self.id;

                            const createdBy = Person.parse(ms.currentVersion.createdBy);

                            return {
                                self: self,
                                currentVersion: currentVersion,
                                createdBy: createdBy
                            };
                        });



                    return Observable.concat(
                        Observable.of(this._materialVersionActions.materialUploadProgress(action.payload.location,
                            null, action.payload.file, -1)),
                        Observable.of(this._materialVersionActions.loadMaterialVersionsComplete(
                            materials.map(x => x.currentVersion))),
                        Observable.of(this._agendaItemMaterialActions.loadMaterialsComplete(materials.map(x => x.self))),
                        Observable.of(this._folderActions.loadFoldersComplete(folders)),
                        Observable.of(this._personActions.loadPersonsComplete(materials.map(x => x.createdBy))));


                }).mergeAll())
            )[0]
            .catch(error => Observable.of(this._errorActions.errorOccurred(error))));
}
