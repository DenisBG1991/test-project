import {Injectable} from '@angular/core';
import {MaterialService} from '@app/services/api/material.service';
import {PersonActions} from '@app/store/person/person.actions';
import {ErrorActions} from '@app/store/error/error.actions';
import {MaterialVersionActions} from '@app/store/material-version/material-version.actions';
import {IssueMaterialActions} from '@app/store/issue-material/issue-material.actions';
import {DecisionActions} from '@app/store/decision/decision.actions';
import {Observable} from 'rxjs/Observable';
import 'rxjs/observable/concat';
import 'rxjs/observable/of';

@Injectable()
export class IssueMaterialEpics {
    constructor(private _materialService: MaterialService,
                private _personActions: PersonActions,
                private _issueMaterialActions: IssueMaterialActions,
                private _materialVersionActions: MaterialVersionActions,
                private _decisionActions: DecisionActions,
                private _errorActions: ErrorActions) {

    }

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
                    // Observable.of(this._decisionActions.loadDecisionsComplete(result.decisions)), // TODO: этому тут не место
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
        .flatMap(action => this._materialService.changeMaterialType(action.payload.issue, action.payload.material, action.payload.type)
            .map(() => this._issueMaterialActions.materialTypeChanged(action.payload.issue, action.payload.material, action.payload.type))
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
