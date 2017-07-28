import {Injectable} from '@angular/core';
import {AgendaItemActions} from '@app/store/agenda-item/agenda-item.actions';
import {AgendaService} from '@app/services/api/agenda.service';
import {PersonActions} from '@app/store/person/person.actions';
import {AgendaItemParticipantActions} from '@app/store/agenda-item-participants/agenda-item-participant.actions';
import {ErrorActions} from '@app/store/error/error.actions';
import {NgRedux} from '@angular-redux/store';
import {IAppState} from '@app/store/store';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/concat';
import {AgendaItemLayoutActions} from '@app/store/layout/agenda-item-layout.actions';
import {MeetingParticipantActions} from '@app/store/meeting-participant/meeting-participant.actions';
import 'rxjs/add/observable/forkJoin';
import {MeetingService} from '@app/services/api/meeting.service';
@Injectable()
export class AgendaItemEpics {

    constructor(private _ngRedux: NgRedux<IAppState>,
                private _agendaService: AgendaService,
                private _meetingService: MeetingService,
                private _agendaItemActions: AgendaItemActions,
                private _personActions: PersonActions,
                private _agendaItemParticipantActions: AgendaItemParticipantActions,
                private _errorActions: ErrorActions,
                private _agendaItemLayoutActions: AgendaItemLayoutActions,
                private _meetingParticipantActions: MeetingParticipantActions) {
    }

    loadAgendaItem = action$ => action$
        .ofType(AgendaItemActions.LoadSingleAgendaItem)
        .switchMap(action => Observable.forkJoin(
            this._meetingService.getParticipants(action.payload.agendaItem.meeting),
            this._agendaService.getAgendaItem(action.payload.agendaItem),
            (meetingResult, agendaItemResult) => {
                return {
                    meetingResult: meetingResult,
                    agendaItemResult: agendaItemResult
                };
            })
            .switchMap(result => {
                const agendaParticipants = result.agendaItemResult.participants
                    .filter(x => x.agendaItem.issue.id === action.payload.agendaItem.issue.id
                    && x.agendaItem.meeting.id === action.payload.agendaItem.meeting.id);
                return Observable.concat(
                    Observable.of(this._meetingParticipantActions.loadMeetingParticipantsComplete(
                        result.meetingResult.participants)),
                    Observable.of(this._agendaItemActions.updateAgendaItems([result.agendaItemResult.agendaItem])),
                    Observable.of(this._personActions.loadPersonsComplete(result.agendaItemResult.persons)),
                    Observable.of(this._agendaItemParticipantActions.updateAgendaItemParticipants(
                        result.agendaItemResult.participants,
                        result.meetingResult.participants)),
                    Observable.of(this._agendaItemLayoutActions.loadAttendeesAgendaItemLayoutState(agendaParticipants))
                );
            })
            .catch(error => Observable.of(this._errorActions.errorOccurred(error)))
        )

    moveAgendaItem = action$ => action$
        .ofType(AgendaItemActions.MoveAgendaItem)
        .switchMap(action => this._agendaService.moveAgendaItem(action.payload.agendaItem, action.payload.order)
            .map(() => {
                let meetingAgendaItems = this._ngRedux.getState().agendaItems
                    .filter(x => x.meeting.id === action.payload.agendaItem.meeting.id);

                const srcItem = meetingAgendaItems.find(i => i.issue.id === action.payload.agendaItem.issue.id);
                const trgItem = meetingAgendaItems.find(i => i.order === action.payload.order);

                // order'ы изменяются только в пределах диапазона перемещения
                // вычисляем диапазон
                // сортируем элементы в нужном порядке (в прямом при перемещении вниз и в обратном при перемещении вверх)
                // swap'аем соседние элементы уполрядоченного диапазона, имитируя перемещение элемента вверх/вниз по списку
                const moveUp = trgItem.order < srcItem.order;

                const dragRangeStart = Math.min(trgItem.order, srcItem.order);
                const dragRangeEnd = Math.max(trgItem.order, srcItem.order);

                const itemsInRange = meetingAgendaItems.filter(x => x.order >= dragRangeStart && x.order <= dragRangeEnd)
                    .sort((one, two) => {
                        if (one.order > two.order) {
                            return moveUp ? -1 : 1;
                        }
                        if (one.order < two.order) {
                            return moveUp ? 1 : -1;
                        }
                        return 0;
                    });

                for (let index = 0; index < itemsInRange.length - 1; index++) {
                    const orderBuf = itemsInRange[index].order;
                    itemsInRange[index].order = itemsInRange[index + 1].order;
                    itemsInRange[index + 1].order = orderBuf;

                    const buf = itemsInRange[index];
                    itemsInRange[index] = itemsInRange[index + 1];
                    itemsInRange[index + 1] = buf;
                }

                meetingAgendaItems = meetingAgendaItems.filter(x => x.order < dragRangeStart || x.order > dragRangeEnd)
                    .concat(itemsInRange);

                return this._agendaItemActions.updateAgendaItems(meetingAgendaItems);
            })
            .catch(error => Observable.of(this._errorActions.errorOccurred(error))))

    removeAgendaItem = action$ => action$
        .ofType(AgendaItemActions.RemoveAgendaItem)
        .switchMap(action => this._agendaService.removeAgendaItem(action.payload.agendaItem)
            .map(() => this._agendaItemActions.removeAgendaItemComplete(action.payload.agendaItem))
            .catch(error => Observable.of(this._errorActions.errorOccurred(error))));

    moveAgendaItemState = action$ => action$
        .ofType(AgendaItemActions.MoveAgendaItemState)
        .switchMap(action => this._agendaService.moveAgendaItemState(action.payload.agendaItem, action.payload.action)
            .map(agendaItem => this._agendaItemActions.updateAgendaItems([agendaItem]))
            .catch(error => Observable.of(this._errorActions.errorOccurred(error))));

    createAgendaItems = action$ => action$
        .ofType(AgendaItemActions.CreateAgendaItems)
        .flatMap(action => this._agendaService.createAgendaItems(action.payload.agendaItems, action.payload.meeting)
            .map(agendaItems => this._agendaItemActions.updateAgendaItems(agendaItems))
            .catch(error => Observable.of(this._errorActions.errorOccurred(error))));
}
