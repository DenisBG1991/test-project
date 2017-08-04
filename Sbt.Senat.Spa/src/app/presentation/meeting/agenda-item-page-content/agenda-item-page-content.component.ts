import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AgendaItemActions} from '@app/store/agenda-item/agenda-item.actions';
import {Observable} from 'rxjs/Observable';
import {NgRedux} from '@angular-redux/store';
import {IAppState} from '@app/store/store';
import {IMeeting} from '@app/store/meeting/meeting.model';
import {IAgendaItem, IAgendaItemIdRef, IAgendaItemRef} from '@app/store/agenda-item/agenda-item.model';
import {IAgendaItemParticipant} from '@app/store/agenda-item-participants/agenda-item-participant.model';
import {IPerson} from '@app/store/person/person.model';
import {AgendaItemParticipantActions} from '@app/store/agenda-item-participants/agenda-item-participant.actions';
import {PersonActions} from '@app/store/person/person.actions';
import {MeetingActions} from '@app/store/meeting/meeting.actions';
import {AgendaItemParticipantRole} from '@app/store/agenda-item-participants/agenda-item-participant-role.model';
import {IMaterialVersion} from '@app/store/material-version/material-version.model';
import {IssueMaterialType} from '@app/store/material/material-type.model';
import {PermissionEnum} from '@app/store/permission';
import {PermissionSelectors} from '@app/store/permission/permission.selectors';
import {PermissionActions} from '@app/store/permission/permission.actions';
import {DecisionActions} from '@app/store/decision/decision.actions';
import {IMeetingParticipant} from '@app/store/meeting-participant/meeting-participant.model';
import {findPersonsByQuery} from '@app/store/person/person.selectors';
import {AgendaItemStatus} from '@app/store/agenda-item/agenda-item-status.model';
import 'rxjs/add/observable/combineLatest';
import {IMaterialFolder} from '@app/store/material/material-folder.model';
import {IMaterialRef} from '@app/store/material';
import {MaterialVersionActions} from '@app/store/material-version/material-version.actions';
import {AgendaItemMaterialActions} from '@app/store/agenda-item-material/agenda-item-material.actions';
import {AgendaItemMaterialFolderActions} from '@app/store/agenda-item-material-folder/agenda-item-material-folder.actions';
import {IAgendaItemMaterial} from '@app/store/agenda-item-material/agenda-item-material.model';
import {Subscription} from 'rxjs/Subscription';
@Component({
    selector: 'senat-agenda-item-page-content',
    templateUrl: './agenda-item-page-content.component.html',
    styleUrls: ['./agenda-item-page-content.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgendaItemPageContentComponent implements OnInit, OnDestroy {

    private _subscriptions: Subscription[];
    agendaItem: IAgendaItemRef;
    agendaItemIdRef: IAgendaItemIdRef;
    query = '';

    canEdit$: Observable<boolean>;
    canChangeState$: Observable<boolean>;

    location = '\\';

    materialExpanded: IMaterialRef;

    //noinspection JSUnusedGlobalSymbols
    /**
     * Текущеее заседание.
     */
    meeting$: Observable<IMeeting> =
        this._ngRedux.select(x => x.meetings.items)
            .map(items => items.find(m => m.id === this.agendaItem.meeting.id))
            .filter(f => !!f);

    //noinspection JSUnusedGlobalSymbols
    /**
     * Текущий вопрос повестки.
     */
    agendaItem$: Observable<IAgendaItem> =
        this._ngRedux.select(x => x.agendaItems)
            .map(items => items.find(i => !!i.id && i.meeting.id === this.agendaItem.meeting.id && i.issue.id === this.agendaItem.issue.id))
            .filter(f => !!f);

    //noinspection JSUnusedGlobalSymbols
    /**
     * Участники вопроса.
     */
    participants$: Observable<Array<{ self: IAgendaItemParticipant, person: IPerson }>> =
        Observable.combineLatest(
            this.agendaItem$,
            this._ngRedux.select(x => x.agendaItemParticipants),
            this._ngRedux.select(x => x.persons),
            (ai, agendaItemParticipants, persons) => {
                return agendaItemParticipants.filter(p => p.agendaItemId.id === ai.id)
                    .map(p => {
                        return {
                            self: p,
                            person: persons.find(pp => pp.id === p.person.id)
                        };
                    })
                    .filter(f => !!f.person)
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
                    })
            })
            .filter(f => !!f);

    //noinspection JSUnusedGlobalSymbols
    /**
     * Список найденных людей для добавления в качестве участников вопроса.
     */
    suggestions$: Observable<Array<IPerson>> =
        this._ngRedux.select(x => x.persons)
            .map(x => findPersonsByQuery(x, this.query))
            .filter(f => !!f);


    meetingParticipants$: Observable<Array<IMeetingParticipant>> =
        this._ngRedux.select(x => x.meetingParticipants)
            .map(m => m.filter(f => f.meeting.id === this.agendaItem.meeting.id));

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
    }>>;

    materialsUploading$: Observable<Array<{
        location: string,
        material: IMaterialRef,
        upload: { file: File, progress: number }
    }>> =
        this._ngRedux.select(x => x.layout.materialsUploading)
            .map(m => m.filter(f => f.location && f.location.startsWith(this.location) &&
            (f.location.split('\\').length - this.location.split('\\').length) === 0));

    versionsUploading$: Observable<Array<{
        location: string,
        material: IMaterialRef,
        upload: { file: File, progress: number }
    }>> =
        this._ngRedux.select(x => x.layout.materialsUploading)
            .map(m => m.filter(f => f.material && f.material.id === this.materialExpanded.id));


    /**
     * Подкаталоги текущего каталога текущего вопроса.
     */
    folders$: Observable<Array<IMaterialFolder>>;

    materials$: Observable<Array<{ self: IAgendaItemMaterial, currentVersion: { self: IMaterialVersion, createdBy: IPerson } }>>;
    versions$: Observable<Array<{ self: IMaterialVersion, createdBy: IPerson }>> = Observable.combineLatest(
        this._ngRedux.select(x => x.materialVersions),
        this._ngRedux.select(x => x.persons),
        (xmv, xp) =>
            xmv.filter(v => this.materialExpanded && v.id === this.materialExpanded.id)
                .sort((one, two) => {
                    if (one.num > two.num) { // сортируем в обратном порядке
                        return -1;
                    }
                    if (one.num < two.num) {
                        return 1;
                    }
                    return 0;
                })
                .map(v => {
                    return {
                        self: v,
                        createdBy: xp.find(p => p.id === v.createdBy.id)
                    };
                })
    );

    constructor(private _route: ActivatedRoute,
                private _ngRedux: NgRedux<IAppState>,
                private _agendaItemActions: AgendaItemActions,
                private _agendaItemParticipantActions: AgendaItemParticipantActions,
                private _meetingActions: MeetingActions,
                private _personActions: PersonActions,
                private _materialActions: AgendaItemMaterialActions,
                private _permissionSelectors: PermissionSelectors,
                private _permissionActions: PermissionActions,
                private _decisionActions: DecisionActions,
                private _folderActions: AgendaItemMaterialFolderActions,
                private _materialVersionActions: MaterialVersionActions) {
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

        this._ngRedux.dispatch(this._agendaItemActions.loadSingleAgendaItem(this.agendaItem));
        this._ngRedux.dispatch(this._meetingActions.loadSingleMeeting(this.agendaItem.meeting));
        this._ngRedux.dispatch(this._decisionActions.loadDecisions(this.agendaItem.meeting));
        // TODO: обойтись загрузкой только agenda-item-page-content'а (добавить в response данные о заседании)

        this._ngRedux.dispatch(this._permissionActions.addIssuePermissions(this.agendaItem.issue));
        this._ngRedux.dispatch(this._permissionActions.addMeetingPermissions(this.agendaItem.meeting));
        // загружаем текущий каталог (корневой)
       // this._ngRedux.dispatch(this._folderActions.loadFolder(this.agendaItemIdRef, this.location));

        this.canEdit$ = Observable.combineLatest(
            this.hasPermission$(PermissionEnum.EditMeeting),
            this.agendaItem$.map(m => m && ([
                AgendaItemStatus.WaitingForConsideration,
                AgendaItemStatus.OnConsideration,
                AgendaItemStatus.OnVoting].indexOf(m.status) >= 0)),
            (p, a) => p && a);


        this.canChangeState$ = Observable.combineLatest(
            this.hasPermission$(PermissionEnum.EditMeeting),
            this.agendaItem$.map(m => m && ([
                AgendaItemStatus.OnConsideration,
                AgendaItemStatus.OnVoting,
                AgendaItemStatus.Resolved].indexOf(m.status) >= 0)),
            (p, a) => p && a);


        this._subscriptions = [
            this.agendaItem$.subscribe(agendaItem => {
                this.agendaItemIdRef = agendaItem;
                this._ngRedux.dispatch(this._materialActions.loadPresentations(agendaItem, this.agendaItem.issue, this.agendaItem.meeting));

                this._ngRedux.dispatch(this._folderActions.loadFolder(agendaItem, this.location));

                this.folders$ = this._ngRedux.select(x => x.agendaItemMaterialFolders)
                    .map(m => m.filter(f => f.agendaItem.id === agendaItem.id &&
                    f.location.startsWith(this.location) &&
                    (f.location.split('\\').length - this.location.split('\\').length) === 1));

                this.materials$ = Observable.combineLatest(
                    this._ngRedux.select(x => x.agendaItemMaterials),
                    this._ngRedux.select(x => x.materialVersions),
                    this._ngRedux.select(x => x.persons),
                    (xaim, xmv, xp) =>
                        xaim.filter(m => m.agendaItem.id === agendaItem.id &&
                        m.location === this.location)
                            .map(m => {
                                const currentVersion = xmv
                                    .find(v => v.id === m.currentVersion.id && v.num === m.currentVersion.num);

                                return {
                                    self: m,
                                    currentVersion: {
                                        self: currentVersion,
                                        createdBy: xp.find(p => p.id === currentVersion.createdBy.id)
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

                this.presentations$ = Observable.combineLatest(
                    this._ngRedux.select(x => x.agendaItemMaterials),
                    this._ngRedux.select(x => x.materialVersions),
                    this._ngRedux.select(x => x.persons),
                    (xaim, xmv, xp) =>
                        xaim.filter(m => m.agendaItem.id === agendaItem.id &&
                        m.type === IssueMaterialType.Presentation)
                            .map(m => {
                                const currentVersion = xmv.find(v => v.id === m.currentVersion.id && v.num === m.currentVersion.num);
                                return {
                                    currentVersion: {
                                        self: currentVersion,
                                        createdBy: xp.find(p => p.id === currentVersion.createdBy.id)
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
            }) // agendaItem$.subscribe
        ]; // _subscriptions

    }

    ngOnDestroy() {
        this._subscriptions.forEach(s => s.unsubscribe());
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
        this._ngRedux.dispatch(this._agendaItemParticipantActions.addParticipantRole(
            this.agendaItem,
            this.agendaItemIdRef,
            e.person,
            e.role));
    }

    removeParticipant(e: { participant: IAgendaItemParticipant, role: AgendaItemParticipantRole }) {
        this._ngRedux.dispatch(this._agendaItemParticipantActions.removeParticipantRole(e.participant, e.role));
    }

    hasPermission$(permission: PermissionEnum): Observable<boolean> {
        return this._ngRedux.select(this._permissionSelectors.meetingHasPermision(permission, this.agendaItem.meeting));
    }


    locationChanged(location: string) {
        this.location = location;
        this._ngRedux.dispatch(this._folderActions.loadFolder(this.agendaItemIdRef, location));
    }

    materialTypeChanged(materialType: {
        material: IMaterialRef,
        type: IssueMaterialType
    }) {
        this._ngRedux.dispatch(this._materialActions.changeMaterialType(
            materialType.material,
            materialType.type));
    }

    materialDeleted(material: IMaterialRef) {
        this._ngRedux.dispatch(this._materialActions.deleteMaterial(material,
            this.agendaItemIdRef));
    }

    materialsAdded(upload: {
        location: string,
        files: File[]
    }) {
        for (const file of upload.files) {
            this._ngRedux.dispatch(this._materialActions.uploadMaterial(
                this.agendaItemIdRef,
                upload.location, file));
        }
    }

    versionsAdded(upload: {
        material: IMaterialRef,
        files: File[]
    }) {
        for (const file of upload.files) {
            this._ngRedux.dispatch(this._materialVersionActions.uploadMaterialVersion(upload.material, file));
        }
    }


    materialVersionExpanded(material: IMaterialRef) {
        this.materialExpanded = material;
        this._ngRedux.dispatch(this._materialVersionActions.loadMaterialVersions(material));
    }
}
