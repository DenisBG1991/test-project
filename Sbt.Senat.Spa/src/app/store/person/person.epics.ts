import {Injectable} from '@angular/core';
import {PersonActions} from '@app/store/person/person.actions';
import {PersonService} from '@app/services/api/person.service';
import {ErrorActions} from '@app/store/error/error.actions';
import {Observable} from 'rxjs/Observable';
import {interval} from 'rxjs/observable/interval';
import 'rxjs/add/operator/debounce';
import 'rxjs/observable/of';

@Injectable()
export class PersonEpics {

    constructor(private _personService: PersonService,
                private _personActions: PersonActions,
                private _errorActions: ErrorActions) {
    }

    findPersons = action$ => action$
        .ofType(PersonActions.LoadPersons)
        .debounce(() => interval(300))
        .switchMap(action =>
            this._personService.getPersons(action.payload.query)
                .map(persons => this._personActions.loadPersonsComplete(persons))
                .catch(error => Observable.concat(
                    Observable.of(this._personActions.loadPersonsFail(error)),
                    Observable.of(this._errorActions.errorOccurred(error))
                )));

}
