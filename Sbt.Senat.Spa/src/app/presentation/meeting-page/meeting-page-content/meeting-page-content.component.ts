import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {NgRedux} from '@angular-redux/store';
import {IAppState} from '@app/store/store';
import {Observable} from 'rxjs/Observable';
import {IMeetingRef} from '@app/store/meeting/meeting-ref.model';
import {AgendaActions} from '@app/store/agenda/agenda.actions';
import {MeetingParticipantActions} from '@app/store/meeting-participant/meeting-participant.actions';
import {IMeetingParticipant} from '@app/store/meeting-participant/meeting-participant.model';
import {IAgendaItem} from '@app/store/agenda-item/agenda-item.model';
import {MeetingActions} from '@app/store/meeting/meeting.actions';
import {PermissionActions} from '@app/store/permission/permission.actions';
import {DecisionActions} from '@app/store/decision/decision.actions';
import {IPerson} from '@app/store/person/person.model';
import {IMaterialVersion} from '@app/store/material-version/material-version.model';
import {IMaterialRef} from '@app/store/material';
import {MaterialVersionActions} from '@app/store/material-version/material-version.actions';
import {IMeetingMaterial} from '@app/store/meeting-material/meeting-material.model';
import 'rxjs/add/operator/combineLatest';
import {PermissionSelectors} from '@app/store/permission/permission.selectors';
import {PermissionEnum} from '@app/store/permission';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';


@Component({
    selector: 'senat-meeting-page-content',
    templateUrl: './meeting-page-content.component.html',
    styleUrls: ['./meeting-page-content.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MeetingPageContentComponent implements OnInit {

    meeting: IMeetingRef;

    private _meetingSubject$: BehaviorSubject<IMeetingRef> = new BehaviorSubject<IMeetingRef>(null);

    materialExpanded: IMaterialRef;

    agendaItems$: Observable<Array<IAgendaItem>> =
        this._ngRedux.select(x => x.agendaItems).map(ai => ai.filter(i => i.meeting.id === this.meeting.id)
            .sort((one, two) => one.order - two.order));

    participants$: Observable<Array<IMeetingParticipant>> = this._ngRedux.select(x => x.meetingParticipants)
        .map(x => x.filter(p => p.meeting.id === this.meeting.id));

    materials$: Observable<Array<{ self: IMeetingMaterial, currentVersion: { self: IMaterialVersion, createdBy: IPerson } }>> =
        this._ngRedux.select(x => x.meetingMaterials)
            .map(x => x.filter(m => m.meeting.id === this.meeting.id))
            .combineLatest(
                this._ngRedux.select(x => x.materialVersions),
                this._ngRedux.select(x => x.persons),
                (materials, versions, persons) => {

                    return materials.map(m => {

                            const currentVersion = versions
                                .find(v => v.id === m.currentVersion.id && v.num === m.currentVersion.num);

                            return {
                                self: m,
                                currentVersion: {
                                    self: currentVersion,
                                    createdBy: persons.find(p => p.id === currentVersion.createdBy.id)
                                }
                            };
                        }
                    )
                })
            .map(x => x.sort((one, two) => {
                if (one.currentVersion.self.fileName > two.currentVersion.self.fileName) {
                    return 1;
                }
                if (one.currentVersion.self.fileName < two.currentVersion.self.fileName) {
                    return -1;
                }
                return 0;
            }));

    versions$: Observable<Array<{ self: IMaterialVersion, createdBy: IPerson }>> =
        this._ngRedux.select(x => x.materialVersions)
            .map(x => x
                .filter(v => this.materialExpanded && v.id === this.materialExpanded.id)
                .sort((one, two) => {
                    if (one.num > two.num) { // сортируем в обратном порядке
                        return -1;
                    }
                    if (one.num < two.num) {
                        return 1;
                    }
                    return 0;
                }))
            .combineLatest(this._ngRedux.select(x => x.persons),
                (materialVersions, persons) => materialVersions.map(mv => {

                    return {
                        self: mv,
                        createdBy: persons.find(p => p.id === mv.createdBy.id)
                    };
                }));

    versionsUploading$: Observable<Array<{
        location: string,
        material: IMaterialRef,
        upload: { file: File, progress: number }
    }>> =
        this._ngRedux.select(x => x.layout.materialsUploading).map(x =>
            x.filter(f => f.material && f.material.id === this.materialExpanded.id));

    hasPermissionsOnVersions$ = this._permissionSelectors.meetingHasPermission$(this._ngRedux.select(x => x.permissions),
        PermissionEnum.EditMeeting, this._meetingSubject$);

    constructor(private _route: ActivatedRoute,
                private _ngRedux: NgRedux<IAppState>,
                private _agendaActions: AgendaActions,
                private _meetingActions: MeetingActions,
                private _meetingParticipantActions: MeetingParticipantActions,
                private _permissionActions: PermissionActions,
                private _decisionActions: DecisionActions,
                private _materialVersionActions: MaterialVersionActions,
                private _permissionSelectors: PermissionSelectors) {
    }

    ngOnInit() {
        this._route.params.forEach((params: Params) => {

            this.meeting = {
                id: params['id']
            };

            this._meetingSubject$.next(this.meeting);

            this._ngRedux.dispatch(this._meetingActions.loadSingleMeeting(this.meeting));
            this._ngRedux.dispatch(this._decisionActions.loadDecisions(this.meeting));
            this._ngRedux.dispatch(this._meetingActions.loadMeetingProtocol(this.meeting));
            this._ngRedux.dispatch(this._permissionActions.addMeetingPermissions(this.meeting));
            this._ngRedux.dispatch(this._agendaActions.getAgenda(this.meeting));
            this._ngRedux.dispatch(this._meetingParticipantActions.loadMeetingParticipants(this.meeting));
        });
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
