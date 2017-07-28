import {Injectable} from '@angular/core';
import {AgendaActions} from '@app/store/agenda/agenda.actions';
import {AgendaService} from '@app/services/api/agenda.service';
import {AgendaItemActions} from '@app/store/agenda-item/agenda-item.actions';
import {ErrorActions} from '@app/store/error/error.actions';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/concat';
import 'rxjs/add/observable/of';

@Injectable()
export class AgendaEpics {

    constructor(private _agendaService: AgendaService,
                private _agendaActions: AgendaActions,
                private _agendaItemAction: AgendaItemActions,
                private _errorActions: ErrorActions) {

    }

    getAgenda = action$ => action$
        .ofType(AgendaActions.GetAgenda)
        .switchMap(action => this._agendaService.getAgenda(action.payload.meeting)
            .switchMap(result => { // это важно, чёрт побери!
                // RXJS преобразует экземпляр класса в plain JS object
                return Observable.concat(
                    Observable.of(this._agendaActions.updateAgenda(result.agenda)),
                    Observable.of(this._agendaItemAction.updateAgendaItems(result.items))
                );
            })
            .catch(error => Observable.of(this._errorActions.errorOccurred(error))))
}
