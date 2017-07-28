import {Injectable} from '@angular/core';
import {ApiService} from '@app/services/api/api.service';
import {
    IMeeting, IMeetingAbsentia, IMeetingPresentia, IMeetingPresentiaMultilingual,
    MeetingType
} from '@app/store/meeting/meeting.model';
import {IMeetingsFilter} from '@app/store/meeting/meetings-filter.model';
import {IPage, IPageInfo} from '@app/store/paging.model';
import {IMeetingParticipant} from '@app/store/meeting-participant/meeting-participant.model';
import {IPerson, IPersonRef} from '@app/store/person/person.model';
import {
    Decision, DecisionApproval,
    MeetingAbsentia, MeetingParticipant, MeetingPresentia, MeetingPresentiaMultilingual,
    Person
} from '@app/services/api/mapping.types';
import {IMeetingRef} from '@app/store/meeting/meeting-ref.model';
import {FormValidationException} from '@app/services/api/validation.error';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {IDecision, IDecisionApproval, IDecisionRef} from '@app/store/decision/decision.model';
import {MeetingWorkflowAction} from '@app/store/meeting/meeting-workflow-action';
import {MeetingsClient} from '@app/shared/api';
import {CustomHttp} from '@app/services/api/http';
import {IMaterialVersionRef} from '@app/store/material-version/material-version.model';
import {IDecisionFilter} from '@app/store/decision/decision-filter.model';

@Injectable()
export class MeetingService extends ApiService {

    constructor(http: CustomHttp,
                private _client: MeetingsClient) {
        super(http);
    }

    /**
     * Возвращает страницу заседаний по соответствующему фильтру.
     * @param filtering
     * @param page
     */
    getMeetings(filtering: IMeetingsFilter, page: IPageInfo): Observable<IPage<IMeeting>> {
        return this.http.get(`api/web/meetings`
            + `?collegialBodyId=${filtering.collegialBody ? filtering.collegialBody.id : ''}`
            + `&num=${filtering.num || ''}`
            + `&from=${this.encodeDate(filtering.from)}`
            + `&to=${this.encodeDate(filtering.to)}`
            + `&page=${page.pageNum}&size=${page.pageSize}`, this.defaultRequestOptions)
            .map(response => {
                const items = response.json().items.map(dto => {
                    const type = dto._discriminator === 'MeetingInAbsentiaLocalizedDto'
                        ? MeetingType.Absentia
                        : MeetingType.Presentia;

                    switch (type) {
                        case MeetingType.Absentia:
                            return MeetingAbsentia.parse(dto);

                        case MeetingType.Presentia:
                            return MeetingPresentia.parse(dto);
                    }
                });

                return {
                    pageNum: response.json().pageNum,
                    pageSize: response.json().pageSize,
                    items: items,
                    itemsTotal: response.json().itemsTotal
                };
            });
    }

    /**
     * Возвращает заседание (с переводами).
     * @param meeting
     */
    getMeeting(meeting: IMeetingRef): Observable<IMeeting> {
        return this.http.get(`api/web/meetings/${meeting.id}`, this.defaultRequestOptions)
            .map(response => {

                const dto = response.json();

                const type = dto._discriminator === 'MeetingInAbsentiaDto'
                    ? MeetingType.Absentia
                    : MeetingType.Presentia;

                switch (type) {
                    case MeetingType.Absentia:
                        return MeetingAbsentia.parse(dto);

                    case MeetingType.Presentia:
                        return MeetingPresentiaMultilingual.parse(dto);
                }
            });
    }

    /**
     * Возвращает список участников комитета.
     * @param meeting
     */
    getParticipants(meeting: IMeetingRef): Observable<{ participants: Array<IMeetingParticipant>, persons: Array<IPerson> }> {
        // возвращает сразу 2 списка - участников и персон, т.к. это модели стора и они связаны только по ключам
        return this.http.get(`api/web/meetings/${meeting.id}/participants`, this.defaultRequestOptions)
            .map(response => {
                const participants: IMeetingParticipant[] = response.json().map(dto => MeetingParticipant.parse(dto));
                participants.forEach(p => {
                    p.meeting = meeting;
                });

                const persons: IPerson[] = response.json().map(dto =>
                    [Person.parse(dto)]
                        .concat((dto.alternates || [])
                            .map(alt => Person.parse(alt))))
                    .reduce((prev, cur) => prev.concat(cur), []);
                // список может содержать дубликаты, чистка дубликатов будет сделана в reducer'е

                return {
                    participants: participants,
                    persons: persons
                };
            });

    }

    /**
     * Добавляет приглашённого на заседание.
     * @param meeting
     * @param person* @returns {Observable<R>}
     */
    addInvitedPerson(meeting: IMeetingRef, person: IPerson): Observable<{ participant: IMeetingParticipant, persons: Array<IPerson> }> {
        return this.http.post(`api/web/meetings/${meeting.id}/invitedPersons`,
            {
                id: person.id
            },
            this.defaultRequestOptions)
            .map(response => {
                const dto = response.json();

                const participant: IMeetingParticipant = MeetingParticipant.parse(dto);
                participant.meeting = meeting;

                const persons: IPerson[] = [Person.parse(dto)]
                    .concat((dto.alternates || [])
                        .map(alt => Person.parse(alt)));
                // список может содержать дубликаты, чистка дубликатов будет сделана в reducer'е

                return {
                    participant: participant,
                    persons: persons
                };
            });
    }

    /**
     * Исключает участника из списка приглашённых на заседание.
     * @param meeting
     * @param person
     */
    removeInvitedPerson(meeting, person: IPerson): Observable<void> {
        return this.http.delete(`api/web/meetings/${meeting.id}/invitedPersons/${person.id}`,
            this.defaultRequestOptions)
            .map(() => {
            });
    }

    /**
     * Создание заочного заседания.
     * @param meeting
     */
    createAbsentiaMeeting(meeting: IMeetingAbsentia): Observable<IMeetingAbsentia> {
        return this.http.post(`api/web/meetings`,
            {
                _discriminator: 'CreateMeetingInAbsentiaDto',
                collegialBody: meeting.collegialBody,
                num: meeting.num,
                agendaDueDate: meeting.agendaDueDate,
                materialsDueDate: meeting.materialsDueDate,
                dateStart: meeting.startDate,
                dateEnd: meeting.endDate
            },
            this.defaultRequestOptions)
            .map(response => {
                const dto = response.json();

                const meetingCreated = MeetingAbsentia.parse(dto);

                return meetingCreated;
            })
            .catch(response => {
                if (response.status === 400) {
                    throw new FormValidationException(response);
                }

                throw response;
            });
    }

    /**
     * Создание очного заседания.
     * @param meeting
     */
    createPresentiaMeeting(meeting: IMeetingPresentiaMultilingual): Observable<IMeetingPresentiaMultilingual> {
        return this.http.post(`api/web/meetings`,
            {
                _discriminator: 'CreateMeetingInPresentiaDto',
                collegialBody: meeting.collegialBody,
                num: meeting.num,
                agendaDueDate: meeting.agendaDueDate,
                materialsDueDate: meeting.materialsDueDate,
                date: meeting.date,
                // благодаря классной типизации и FormGroup, здесь может быть значение "" (пустая строка)
                // (не смотря на инициализацию формы значением null, контрол всё равно будет создан со значением ""),
                // что соответствует отсутствию значения
                // но в случае отсутствия значения, в API должен быть передан null
                address: meeting.address || null,
                place: meeting.place || null
            },
            this.defaultRequestOptions)
            .map(response => {
                const dto = response.json();

                const meetingCreated = MeetingPresentiaMultilingual.parse(dto);

                return meetingCreated;
            })
            .catch(response => {
                if (response.status === 400) {
                    throw new FormValidationException(response);
                }

                throw response;
            });
    }

    /**
     * Создание решения по проекту решения.
     * @param decision
     */
    createDecision(decision: {
                       materialVersion: IMaterialVersionRef;
                       meeting: IMeetingRef;
                       accepted: boolean;
                   }): Observable<IDecision> {
        return this.http.post(`api/v1.0/decisions`,
            {
                meeting: decision.meeting,
                decisionProjectVersion: {
                    id: decision.materialVersion.id,
                    version: decision.materialVersion.num
                },
                type: decision.accepted ? 'Accepted' : 'Declined'
            },
            this.defaultRequestOptions)
            .map(response => {

                const dto = response.json();

                return Decision.parse(dto);
            });
    }


    getDecisions(filtering: IDecisionFilter, page: IPageInfo): Observable<IPage<IDecision>> {
        return this.http.get(`api/v1.0/decisions`
            + `?meetingId=${filtering.meetingId || ''}`
            + `&issueId=${filtering.issueId || ''}`
            + `&page=${page.pageNum}&size=${page.pageSize}`, this.defaultRequestOptions)
            .map(response => {
                const items = response.json().items.map(dto => {
                    return Decision.parse(dto);
                });

                return {
                    pageNum: response.json().pageNum,
                    pageSize: response.json().pageSize,
                    items: items,
                    itemsTotal: response.json().itemsTotal
                };
            });
    }

    /**
     * Изменение статуса заседания.
     * @param meeting
     * @param action
     */
    moveMeetingState(meeting: IMeetingRef, action: MeetingWorkflowAction): Observable<IMeeting> {
        return this.http.post(`api/web/meetings/${meeting.id}/workflow/${action}`, null, this.defaultRequestOptions)
            .map(response => {

                const dto = response.json();

                const type = dto._discriminator === 'MeetingInAbsentiaDto'
                    ? MeetingType.Absentia
                    : MeetingType.Presentia;

                switch (type) {
                    case MeetingType.Absentia:
                        return MeetingAbsentia.parse(dto);

                    case MeetingType.Presentia:
                        return MeetingPresentiaMultilingual.parse(dto);
                }
            });
    }

    /**
     * Сформировать протокол
     * @param meeting
     * @param action
     * @returns {Observable<void>}
     */
    formMeetingProtocol(meeting: IMeetingRef): Observable<void> {
        return this._client.formMeetingProtocol(meeting.id);
    }

    editMeeting(meeting: IMeeting): Observable<IMeeting> {
        const body = this.createEditMeetingBody(meeting);

        return this.http.put(`api/web/meetings/${meeting.id}`,
            body, this.defaultRequestOptions)
            .map(response => {

                const dto = response.json();

                const type = dto._discriminator === 'MeetingInAbsentiaDto'
                    ? MeetingType.Absentia
                    : MeetingType.Presentia;

                switch (type) {
                    case MeetingType.Absentia:
                        return MeetingAbsentia.parse(dto);

                    case MeetingType.Presentia:
                        return MeetingPresentiaMultilingual.parse(dto);
                }
            });
    }

    private createEditMeetingBody(meeting: IMeeting): any {
        if (meeting.type === MeetingType.Absentia) {

            const meetingAbsentia = meeting as IMeetingAbsentia;
            const retValue = {
                _discriminator: 'EditMeetingInAbsentiaDto',
                num: meetingAbsentia.num,
                agendaDueDate: meetingAbsentia.agendaDueDate,
                materialsDueDate: meetingAbsentia.materialsDueDate,
                startDate: meetingAbsentia.startDate,
                endDate: meetingAbsentia.endDate
            };
            return retValue;

        } else {

            const meetingPresentia = meeting as IMeetingPresentia;
            const retValue = {
                _discriminator: 'EditMeetingInPresentiaDto',
                num: meetingPresentia.num,
                agendaDueDate: meetingPresentia.agendaDueDate,
                materialsDueDate: meetingPresentia.materialsDueDate,
                date: meetingPresentia.date,
                address: meetingPresentia.address || null,
                place: meetingPresentia.place || null
            };
            return retValue;
        }
    }

    /**
     * Отправка решения на согласование
     * @param decision
     * @param person
     * @returns {Observable<R>}
     */
    sendDecisionToApproval(decision: IDecisionRef, person: IPersonRef): Observable<IDecision> {
        return this.http.put(`api/v1.0/decisions/${decision.id}`,
            {
                approval: {
                    approvingPerson: {
                        id: person.id
                    },
                    approved: false
                }
            },
            this.defaultRequestOptions)
            .map(response => {

                const dto = response.json();

                return Decision.parse(dto);
            });
    }

    approveDecision(decision: IDecisionRef): Observable<IDecisionApproval> {
        return this.http.put(`api/v1.0/decisions/${decision.id}/approval`,
            {
                approved: true
            },
            this.defaultRequestOptions)
            .map(response => {

                const dto = response.json();

                return DecisionApproval.parse(dto);
            });
    }

    delete(meeting: IMeetingRef): Observable<void> {
        return this._client.deleteMeeting(meeting.id);
    }
}

