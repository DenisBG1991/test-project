import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AgendaItemActions} from '@app/store/agenda-item/agenda-item.actions';
import {Observable} from 'rxjs/Observable';
import {NgRedux} from '@angular-redux/store';
import {IAppState} from '@app/store/store';
import {IMeeting} from '@app/store/meeting/meeting.model';
import {IAgendaItem, IAgendaItemRef} from '@app/store/agenda-item/agenda-item.model';
import {IAgendaItemParticipant} from '@app/store/agenda-item-participants/agenda-item-participant.model';
import {IPerson, IPersonRef} from '@app/store/person/person.model';
import {AgendaItemParticipantActions} from '@app/store/agenda-item-participants/agenda-item-participant.actions';
import {PersonActions} from '@app/store/person/person.actions';
import {MeetingActions} from '@app/store/meeting/meeting.actions';
import {AgendaItemParticipantRole} from '@app/store/agenda-item-participants/agenda-item-participant-role.model';
import {IMaterialVersion} from '@app/store/material-version/material-version.model';
import {MaterialType} from '@app/store/material/material-type.model';
import {IssueMaterialActions} from '@app/store/issue-material/issue-material.actions';
import {PermissionEnum} from '@app/store/permission';
import {PermissionSelectors} from '@app/store/permission/permission.selectors';
import {PermissionActions} from '@app/store/permission/permission.actions';
import {DecisionActions} from '@app/store/decision/decision.actions';
import {IMeetingParticipant} from '@app/store/meeting-participant/meeting-participant.model';
import {findPersonsByQuery} from '@app/store/person/person.selectors';

@Component({
    selector: 'senat-agenda-item-page-content',
    templateUrl: './agenda-item-page-content.component.html',
    styleUrls: ['./agenda-item-page-content.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgendaItemPageContentComponent implements OnInit {

    agendaItem: IAgendaItemRef;
    query = '';

    canEdit$: Observable<boolean>;

    //noinspection JSUnusedGlobalSymbols
    /**
     * Текущеее заседание.
     */
    meeting$: Observable<IMeeting> =
        this._ngRedux.select(x => x.meetings.items.find(m => m.id === this.agendaItem.meeting.id));

    //noinspection JSUnusedGlobalSymbols
    /**
     * Текущий вопрос повестки.
     */
    agendaItem$: Observable<IAgendaItem> =
        this._ngRedux.select(x => x.agendaItems
            .find(i => i.meeting.id === this.agendaItem.meeting.id && i.issue.id === this.agendaItem.issue.id));

    //noinspection JSUnusedGlobalSymbols
    /**
     * Участники вопроса.
     */
    participants$: Observable<Array<{ self: IAgendaItemParticipant, person: IPerson }>> =
        this._ngRedux.select(x => x.agendaItemParticipants
            .filter(p => p.agendaItem.meeting.id === this.agendaItem.meeting.id &&
            p.agendaItem.issue.id === this.agendaItem.issue.id)
            .map(p => {
                return {
                    self: p,
                    person: x.persons.find(pp => pp.id === p.person.id)
                };
            })
            .sort((one, two) => {
                const fullNameOne = `${one.person.lastName} ${one.person.firstName} ${one.person.middleName}`;
                const fullNameTwo = `${two.person.lastName} ${two.person.firstName} ${two.person.middleName}`;

                if (fullNameOne > fullNameTwo) {
                    return 1;
                }
                if (fullNameOne < fullNameTwo) {
                    return -1;
                }
                return 0;
            }));

    attendeesLayout$: Observable<Array<{ person: IPersonRef, prevPresents: boolean }>> =
        this._ngRedux.select(x => x.layout.agendaItem.attendees)
            .map(x => x.map(p => {
                return {
                    person: p.person,
                    prevPresents: p.prevPresents
                };
            }));
    //noinspection JSUnusedGlobalSymbols
    /**
     * Список найденных людей для добавления в качестве участников вопроса.
     */
    suggestions$: Observable<Array<IPerson>> =
        this._ngRedux.select(x => findPersonsByQuery(x, this.query));


    meetingParticipants$: Observable<Array<IMeetingParticipant>> =
        this._ngRedux.select(x => x.meetingParticipants.filter(f => f.meeting.id === this.agendaItem.meeting.id));

    persons$: Observable<Array<IPerson>> =
        this._ngRedux.select(x => x.persons);

    //noinspection JSUnusedGlobalSymbols
    /**
     * Презентации.
     */
    presentations$: Observable<Array<{
        currentVersion: {
            self: IMaterialVersion,
            createdBy: IPerson
        }
    }>> =
        this._ngRedux.select(x => x.issueMaterials
            .filter(m => m.issue.id === this.agendaItem.issue.id && m.type === MaterialType.Presentation)
            .map(m => {
                const currentVersion = x.materialVersions.find(v => v.id === m.currentVersion.id && v.num === m.currentVersion.num);
                return {
                    currentVersion: {
                        self: currentVersion,
                        createdBy: x.persons.find(p => p.id === currentVersion.createdBy.id)
                    }
                };
            })
            .sort((one, two) => {
                if (one.currentVersion.self.fileName > two.currentVersion.self.fileName) {
                    return 1;
                }
                if (one.currentVersion.self.fileName < two.currentVersion.self.fileName) {
                    return -1;
                }
                return 0;
            }));

    constructor(private _route: ActivatedRoute,
                private _ngRedux: NgRedux<IAppState>,
                private _agendaItemActions: AgendaItemActions,
                private _agendaItemParticipantActions: AgendaItemParticipantActions,
                private _meetingActions: MeetingActions,
                private _personActions: PersonActions,
                private _issueMaterialActions: IssueMaterialActions,
                private _permissionSelectors: PermissionSelectors,
                private _permissionActions: PermissionActions,
                private _decisionActions: DecisionActions) {
    }

    ngOnInit() {
        // данный компонент - контейнер
        // при инициализации он инициирует загрузку/обновление agendaItem'а и заседание

        this._route.params.forEach(params => {
            this.agendaItem = {
                meeting: {
                    id: params['meetingId']
                },
                issue: {
                    id: params['issueId']
                }
            };
        });

        this._ngRedux.dispatch(this._agendaItemActions.loadAgendaItem(this.agendaItem));
        this._ngRedux.dispatch(this._meetingActions.loadSingleMeeting(this.agendaItem.meeting));
        this._ngRedux.dispatch(this._decisionActions.loadDecisions(this.agendaItem.meeting));
        // TODO: обойтись загрузкой только agenda-item-page-content'а (добавить в response данные о заседании)
        this._ngRedux.dispatch(this._issueMaterialActions.loadPresentations(this.agendaItem.issue));
        this._ngRedux.dispatch(this._permissionActions.addIssuePermissions(this.agendaItem.issue));
        this._ngRedux.dispatch(this._permissionActions.addMeetingPermissions(this.agendaItem.meeting));

        this.canEdit$ = this.hasPermission$(PermissionEnum.EditMeeting);
    }

    /**
     * Отметка присутствия участника.
     * @param participant
     */
    checkIn(participant: IAgendaItemParticipant) {
        this._ngRedux.dispatch(this._agendaItemParticipantActions.checkInParticipant(participant));
    }

    /**
     * Отметка отсутствия участника.
     * @param participant
     */
    checkOut(participant: IAgendaItemParticipant) {
        this._ngRedux.dispatch(this._agendaItemParticipantActions.checkOutParticipant(participant));
    }

    /**
     * Поиск людей для добавления в качестве участников.
     * @param query
     */
    findPeople(query: string) {
        this.query = query;
        this._ngRedux.dispatch(this._personActions.loadPersons(query));
    }

    addParticipant(e: { person: IPerson, role: AgendaItemParticipantRole }) {
        this._ngRedux.dispatch(this._agendaItemParticipantActions.addParticipantRole(this.agendaItem, e.person, e.role));
    }

    removeParticipant(e: { participant: IAgendaItemParticipant, role: AgendaItemParticipantRole }) {
        this._ngRedux.dispatch(this._agendaItemParticipantActions.removeParticipantRole(e.participant, e.role));
    }

    hasPermission$(permission: PermissionEnum): Observable<boolean> {
        return this._ngRedux.select(this._permissionSelectors.meetingHasPermision(permission, this.agendaItem.meeting));
    }
}
