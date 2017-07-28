import {Injectable} from '@angular/core';

import {PersonService} from '@app/services/api/person.service';
import {ErrorActions} from '@app/store/error/error.actions';
import {Observable} from 'rxjs/Observable';
import {interval} from 'rxjs/observable/interval';
import 'rxjs/add/operator/debounce';
import 'rxjs/observable/of';
import {PersonActions} from '@app/store/admin/person/person.actions';
import {ValidationService} from '@app/services/validation.service';
import {Validators} from '@angular/forms';

@Injectable()
export class PersonEpics {

    constructor(private _personService: PersonService,
                private _personActions: PersonActions,
                private _errorActions: ErrorActions,
                private _validationService: ValidationService) {
    }

    loadSinglePerson = (action$) => action$
        .ofType(PersonActions.LoadSinglePerson)
        .switchMap(action => this._personService.getPerson(action.payload.person) // обращаемся к API
            .switchMap(person => {
                const formGroup = this._validationService.createFormGroup(person, [
                    {
                        propExpression: x => x.lastName,
                        validators: [
                            this._validationService.requiredMultilingual()
                        ]
                    },
                    {
                        propExpression: x => x.firstName,
                        validators: [
                            this._validationService.requiredMultilingual()
                        ]
                    },
                    {
                        propExpression: x => x.middleName,
                        validators: [
                            this._validationService.requiredMultilingual()
                        ]
                    }
                ]);

                return Observable.concat(
                    Observable.of(this._personActions.loadSinglePersonComplete(person)),
                    Observable.of(this._personActions.personFormChanged(formGroup))
                );

            })
            .catch(error => Observable.concat(
                Observable.of(this._personActions.loadSinglePersonFail(error)),
                Observable.of(this._errorActions.errorOccurred(error))
            )))


    createPerson = action$ => action$
        .ofType(PersonActions.CreatePerson)
        .switchMap(action =>
            this._personService.createPerson(action.payload.formGroup.value)
                .map(person => this._personActions.createPersonComplete(person))
                .catch(error => Observable.concat(
                    Observable.of(this._personActions.createPersonFail(error)),
                    Observable.of(this._errorActions.errorOccurred(error))
                )));
    updatePerson = action$ => action$
        .ofType(PersonActions.UpdatePerson)
        .switchMap(action =>
            this._personService.updatePerson(action.payload.formGroup.value)
                .map(person => this._personActions.loadSinglePersonComplete(person))
                .catch(error => Observable.concat(
                    Observable.of(this._personActions.updatePersonFail(error)),
                    Observable.of(this._errorActions.errorOccurred(error))
                )));

}
