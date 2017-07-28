import {Injectable} from '@angular/core';
import {ApiService} from '@app/services/api/api.service';
import {IAgenda} from '@app/store/agenda/agenda.model';
import {IAgendaItem, IAgendaItemRef} from '@app/store/agenda-item/agenda-item.model';
import {Agenda, AgendaItem, AgendaItemParticipant, Person} from '@app/services/api/mapping.types';
import {Observable} from 'rxjs/Observable';
import {IAgendaItemParticipant} from '@app/store/agenda-item-participants/agenda-item-participant.model';
import {IPerson} from '@app/store/person/person.model';
import {IMeetingRef} from '@app/store/meeting/meeting-ref.model';
import {AgendaItemWorkflowAction} from '@app/store/agenda-item/agenda-item-workflow-action';
import {CustomHttp} from '@app/services/api/http';

@Injectable()
export class AgendaService extends ApiService {
    constructor(http: CustomHttp) {
        super(http);
    }

    /**
     * Возвращает повестку заседания.
     */
    getAgenda(meeting: IMeetingRef): Observable<{ agenda: IAgenda, items: Array<IAgendaItem> }> {
        return this.http.get(`api/web/meetings/${meeting.id}/agenda`, this.defaultRequestOptions)
            .map(response => {
                const dto = response.json();

                const agenda = Agenda.parse(dto);
                const items = dto.items.map(x => AgendaItem.parse(x));
                items.forEach(x => {
                    x.meeting = {
                        id: meeting.id
                    };
                });

                return {
                    agenda: agenda,
                    items: items
                };
            });
    }

    /**
     * Возвращает отдельный вопрос повестки.
     * @param agendaItem
     */
    getAgendaItem(agendaItem: IAgendaItemRef): Observable<{
        agendaItem: IAgendaItem,
        participants: Array<IAgendaItemParticipant>,
        persons: Array<IPerson>
    }> {
        return this.http.get(`api/web/meetings/${agendaItem.meeting.id}/agenda/${agendaItem.issue.id}`,
            this.defaultRequestOptions)
            .map(response => {
                const dto = response.json();

                // TODO: избавиться от _discriminator в пользу "type", например
                const presentia = dto._discriminator === 'AgendaItemInPresentiaDto';

                const item = AgendaItem.parse(dto);
                item.meeting = {
                    id: agendaItem.meeting.id // TODO: добавить в response meetingRef
                };

                const participants = presentia ? dto.participants.map(x => AgendaItemParticipant.parse(x)) : [];
                participants.forEach(p => {
                    p.agendaItem = {
                        meeting: {
                            id: agendaItem.meeting.id
                        },
                        issue: {
                            id: agendaItem.issue.id
                        }
                    };
                });

                const persons = presentia ? dto.participants.map(x => Person.parse(x)) : [];

                return {
                    agendaItem: item,
                    participants: participants,
                    persons: persons
                };
            });
    }

    /**
     * Перемещение вопроса в повестке (изменение номера в повестке).
     * @param item
     * @param order
     */
    moveAgendaItem(item: IAgendaItemRef, order: number): Observable<IAgendaItem> {
        return this.http.put(`api/web/meetings/${item.meeting.id}/agenda/${item.issue.id}`,
            {
                '_discriminator': 'AgendaItemInAbsentiaDto', // TODO: избавиться от необходимости отправлять это поле
                issue: {
                    id: item.issue.id
                },
                order: order
            }, this.defaultRequestOptions)
            .map(response => {

                const agendaItem: IAgendaItem = AgendaItem.parse(response.json());
                agendaItem.meeting = {
                    id: item.meeting.id
                };

                return agendaItem;
            });
    }

    removeAgendaItem(item: IAgendaItemRef): Observable<void> {
        return this.http.delete(`api/web/meetings/${item.meeting.id}/agenda/${item.issue.id}`, this.defaultRequestOptions)
            .map(() => {
            });
    }

    /**
     * Отмечает участника вопроса присутствующим.
     * @param participant
     */
    checkInParticipant(participant: IAgendaItemParticipant): Observable<{ participant: IAgendaItemParticipant, person: IPerson }> {
        return this.http.post(`api/web/meetings/${participant.agendaItem.meeting.id}`
            + `/agenda/${participant.agendaItem.issue.id}/attendees`,
            {
                id: participant.person.id
            },
            this.defaultRequestOptions)
            .map(response => {
                const dto = response.json();

                const participantUpdated = AgendaItemParticipant.parse(dto);
                participantUpdated.agendaItem = {
                    meeting: {
                        id: participant.agendaItem.meeting.id
                    },
                    issue: {
                        id: participant.agendaItem.issue.id
                    }
                };

                const person = Person.parse(dto);

                return {
                    participant: participantUpdated,
                    person: person
                };
            });
    }

    /**
     * Отмечает участника вопроса отсутствующим.
     * @param participant
     */
    checkOutParticipant(participant: IAgendaItemParticipant): Observable<{ participant: IAgendaItemParticipant, person: IPerson }> {
        return this.http.delete(`api/web/meetings/${participant.agendaItem.meeting.id}`
            + `/agenda/${participant.agendaItem.issue.id}/attendees/${participant.person.id}`,
            this.defaultRequestOptions)
            .map(response => {
                const dto = response.json();

                const participantUpdated = AgendaItemParticipant.parse(dto);
                participantUpdated.agendaItem = {
                    meeting: {
                        id: participant.agendaItem.meeting.id
                    },
                    issue: {
                        id: participant.agendaItem.issue.id
                    }
                };

                const person = Person.parse(dto);

                return {
                    participant: participantUpdated,
                    person: person
                };
            });
    }

    addAgendaItemSpeaker(agendaItem: IAgendaItemRef, person: IPerson): Observable<{
        participant: IAgendaItemParticipant,
        person: IPerson
    }> {
        return this.http.post(`api/web/meetings/${agendaItem.meeting.id}`
            + `/agenda/${agendaItem.issue.id}/speakers`,
            {
                id: person.id
            },
            this.defaultRequestOptions)
            .map(response => {
                const dto = response.json();

                const participantUpdated = AgendaItemParticipant.parse(dto);
                participantUpdated.agendaItem = {
                    meeting: {
                        id: agendaItem.meeting.id
                    },
                    issue: {
                        id: agendaItem.issue.id
                    }
                };

                const personUpdated = Person.parse(dto);

                return {
                    participant: participantUpdated,
                    person: personUpdated
                };
            });
    }

    removeAgendaItemSpeaker(participant: IAgendaItemParticipant): Observable<void> {
        return this.http.delete(`api/web/meetings/${participant.agendaItem.meeting.id}`
            + `/agenda/${participant.agendaItem.issue.id}/speakers/${participant.person.id}`,
            this.defaultRequestOptions)
            .map(() => {
            });
    }

    addAgendaItemInvitedPerson(agendaItem: IAgendaItemRef, person: IPerson): Observable<{
        participant: IAgendaItemParticipant,
        person: IPerson
    }> {
        return this.http.post(`api/web/meetings/${agendaItem.meeting.id}`
            + `/agenda/${agendaItem.issue.id}/invitedPersons`,
            {
                id: person.id
            },
            this.defaultRequestOptions)
            .map(response => {
                const dto = response.json();

                const participantUpdated = AgendaItemParticipant.parse(dto);
                participantUpdated.agendaItem = {
                    meeting: {
                        id: agendaItem.meeting.id
                    },
                    issue: {
                        id: agendaItem.issue.id
                    }
                };

                const personUpdated = Person.parse(dto);

                return {
                    participant: participantUpdated,
                    person: personUpdated
                };
            });
    }

    removeAgendaItemInvitedPerson(participant: IAgendaItemParticipant): Observable<void> {
        return this.http.delete(`api/web/meetings/${participant.agendaItem.meeting.id}`
            + `/agenda/${participant.agendaItem.issue.id}/invitedPersons/${participant.person.id}`,
            this.defaultRequestOptions)
            .map(() => {
            });
    }

    /**
     * Изменяет статус вопроса в повестке.
     * @param agendaItem
     * @param action
     */
    moveAgendaItemState(agendaItem: IAgendaItemRef, action: AgendaItemWorkflowAction): Observable<IAgendaItem> {
        return this.http.post(`api/web/meetings/${agendaItem.meeting.id}`
            + `/agenda/${agendaItem.issue.id}/${action}`,
            null, this.defaultRequestOptions)
            .map(response => {
                const agendaItemUpdated: IAgendaItem = AgendaItem.parse(response.json());
                agendaItemUpdated.meeting = {
                    id: agendaItem.meeting.id
                };

                return agendaItemUpdated;
            });
    }

    /**
     * Добавляет вопрос в повестку.
     * @param agendaItem
     */
    createAgendaItems(agendaItems: Array<IAgendaItemRef>, meeting: IMeetingRef): Observable<Array<IAgendaItem>> {
        const payload = agendaItems.map(ai => {
            return {
                id: ai.issue.id
            };
        });
        return this.http.post(`api/web/meetings/${meeting.id}/agenda/`,
            {
                issues: payload
            }, this.defaultRequestOptions)
            .map(response => {
                const agendaItemResponse = response.json() as {items: Array<any>};
                return agendaItemResponse.items.map(dto => {
                    const agendaItemCreated: IAgendaItem = AgendaItem.parse(dto);
                    agendaItemCreated.meeting = {
                        id: meeting.id
                    };
                    return agendaItemCreated;
                });
            });
    }
}
