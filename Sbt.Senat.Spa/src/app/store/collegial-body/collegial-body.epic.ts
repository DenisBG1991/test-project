import {Injectable} from '@angular/core';
import {CollegialBodyService} from '@app/services/api/collegial-body.service';
import {CollegialBodyActions} from '@app/store/collegial-body/collegial-body.actions';
import {ErrorActions} from '@app/store/error/error.actions';
import {Observable} from 'rxjs/Observable';
import 'rxjs/observable/concat';
import 'rxjs/observable/of';

@Injectable()
export class CollegialBodyEpics {

    constructor(private _collegialBodyService: CollegialBodyService,
                private _collegialBodyActions: CollegialBodyActions,
                private _errorActions: ErrorActions) {
    }

    loadCollegialBodies = (action$) => action$
        .ofType(CollegialBodyActions.UpdateCollegialBodies)
        .switchMap(() => this._collegialBodyService.getCollegialBodies()
            .map(collegialBodies => this._collegialBodyActions.updateCollegialBodiesComplete(collegialBodies))
            .catch(error => Observable.concat(
                Observable.of(this._collegialBodyActions.updateCollegialBodiesFail(error)),
                Observable.of(this._errorActions.errorOccurred(error))
            )));
}
