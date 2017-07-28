import {Injectable} from '@angular/core';
import {LabelActions} from '@app/store/label/label.actions';
import {ErrorActions} from '@app/store/error/error.actions';
import {Observable} from 'rxjs/Observable';
import {LabelService} from '@app/services/api/label.service';

@Injectable()
export class LabelEpics {

    constructor(private _labelActions: LabelActions, private  _errorActions: ErrorActions,
                private _labelService: LabelService) {
    }

    createLabel = (action$) => action$
        .ofType(LabelActions.CreateLabel)
        .switchMap(action => this._labelService.createLabel(action.payload.labelName)
            .map(label => {
                return this._labelActions.loadLabelsCompleted([label]);
            }))
        .catch(error => Observable.concat(
            Observable.of(this._labelActions.createLabelFailed(error)),
            Observable.of(this._errorActions.errorOccurred(error))
        ));

    loadLabels = (action$) => action$
        .ofType(LabelActions.LoadLabels)
        .switchMap(action => this._labelService.findLabels(action.payload.filter)
            .switchMap(labels => {
                return Observable.of(this._labelActions.loadLabelsCompleted(labels));
            }))
        .catch(error => Observable.concat(
            Observable.of(this._labelActions.loadLabelsFailed(error)),
            Observable.of(this._errorActions.errorOccurred(error))
        ));
}

