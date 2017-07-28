import {Component, Inject, OnInit} from '@angular/core';
import {NgRedux} from '@angular-redux/store';
import {IAppState} from '@app/store/store';
import {Observable} from 'rxjs/Observable';
import {IMeeting} from '@app/store/meeting/meeting.model';
import {ActivatedRoute} from '@angular/router';
import {MeetingActions} from '@app/store/meeting/meeting.actions';
import {IMeetingRef} from '@app/store/meeting/meeting-ref.model';
import {FormGroup} from '@angular/forms';
import {interval} from 'rxjs/observable/interval';
import {MeetingWorkflowAction} from '@app/store/meeting/meeting-workflow-action';
import {MeetingStatus} from '@app/store/meeting/meeting-status';
import {AppConfigInjectionToken, IAppConfig} from '@app/config';
import {MeetingLayoutActions} from '@app/store/layout/meeting-layout.actions';
import {PermissionEnum} from '@app/store/permission';
import {PermissionSelectors} from '@app/store/permission/permission.selectors';
import {PermissionActions} from '@app/store/permission/permission.actions';
import {ButtonType} from '@app/presentation/ui-kit/button/button.component';


declare var document: any;

@Component({
    selector: 'senat-meeting-page-header',
    templateUrl: './meeting-page-header.component.html',
    styleUrls: ['./meeting-page-header.component.css']
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class MeetingPageHeaderComponent implements OnInit {


    buttonType = ButtonType;
    meetingStatus = MeetingStatus;

    private _meeting: IMeetingRef;

    editMode$: Observable<boolean> =
        this._ngRedux.select(x => x.layout.meeting.editMode);

    permissions = PermissionEnum;

    presentiaFormGroup: FormGroup;
    absentiaFormGroup: FormGroup;

    meeting: IMeeting;

    meeting$: Observable<IMeeting> =
        this._ngRedux.select(x => x.meetings.items.find(m => m.id === this._meeting.id));

    get canEdit$(): Observable<boolean> {
        return this.hasPermission$(PermissionEnum.EditMeeting);
    }

    constructor(private _ngRedux: NgRedux<IAppState>,
                private _route: ActivatedRoute,
                private _meetingActions: MeetingActions,
                private _meetingLayoutActions: MeetingLayoutActions,
                private _permissionSelectors: PermissionSelectors,
                private _permissionActions: PermissionActions,
                @Inject(AppConfigInjectionToken) protected config: IAppConfig) {
    }

    ngOnInit() {
        this._route.params.forEach(x => {
            this._meeting = {
                id: x['id']
            };

            this._ngRedux.select(s => s.meetings.items.find(m => m.id === this._meeting.id))
                .subscribe(meeting => {
                    this.meeting = meeting; // TODO: обойтись без подписки, вынести в отдельный компонент
                });
        });

        // в angular-redux/form нет поддержки reactive forms (FormGroup),
        // поэтому синхронизация делается вручную с помощью подписки на .valueChanges() формы
        // и с некоторым интервалом
        // начальное состояние (initial state) FormGroup в сторе - null, т.к. для создания формы нужен
        // экземпляр FormBuilder
        // иначе initial state уже не может быть объявлен константой, т.к. ему требуется зависимость
        this._ngRedux.select(x => x.layout.meetingPresentiaForm)
            .subscribe(form => {
                this.presentiaFormGroup = form;

                if (form) {
                    this.presentiaFormGroup.valueChanges
                        .debounce(() => interval(300))
                        .subscribe(() => {
                            this._ngRedux.dispatch(this._meetingActions.presentiaMeetingFormChanged(this.presentiaFormGroup));
                        });
                }
            });

        this._ngRedux.select(x => x.layout.meetingAbsentiaForm)
            .subscribe(form => {
                this.absentiaFormGroup = form;

                if (form) {
                    this.absentiaFormGroup.valueChanges
                        .debounce(() => interval(300))
                        .subscribe(() => {
                            this._ngRedux.dispatch(this._meetingActions.absentiaMeetingFormChanged(this.absentiaFormGroup));
                        });
                }
            });
    }

    submit() {
        if (this.presentiaFormGroup) {
            this._ngRedux.dispatch(this._meetingActions.editMeeting(this.presentiaFormGroup));
        } else {
            this._ngRedux.dispatch(this._meetingActions.editMeeting(this.absentiaFormGroup));
        }
    }

    cancel() {
        this._ngRedux.dispatch(this._meetingLayoutActions.changeMeetingLayoutEditMode(false));
    }

    edit() {
        this._ngRedux.dispatch(this._meetingLayoutActions.changeMeetingLayoutEditMode(true));
    }

    /**
     * Возвращает перечень доступных действий в соответствии с workflow.
     * @returns {any}
     */
    getActions(): Array<MeetingWorkflowAction> {
        const status = this.meeting.state;

        if (status === MeetingStatus.Draft) {
            return [
                MeetingWorkflowAction.ToOpened
            ];
        }
        if (status === MeetingStatus.Opened && this.meeting.hasProtocol) {
            return [
                MeetingWorkflowAction.ToClosed
            ];
        }
        return [];
    }

    /**
     * Изменение статуса заседания.
     */
    move(action: MeetingWorkflowAction) {
        this._ngRedux.dispatch(this._meetingActions.moveMeetingState(this._meeting, action));
    }

    formMeetingProtocol() {
        this._ngRedux.dispatch(this._meetingActions.formMeetingProtocol(this._meeting));
    }

    private get downloadLink() {
        return this.config.api.baseUrl + (this.config.api.baseUrl.endsWith('/') ? '' : '/')
            + `api/web/meetings/${this._meeting.id}/protocol`;
    }

    hasPermission$(permission: PermissionEnum): Observable<boolean> {
        return this._ngRedux.select(this._permissionSelectors.meetingHasPermision(permission, this.meeting));
    }

    downloadProtocol() {
        // Simulate href or link
        document.location.href = this.downloadLink;
    }
    delete() {
        if (confirm('Удалить заседание?')) {
            this._ngRedux.dispatch(this._meetingActions.deleteMeeting(this._meeting));
        }
    }
}
