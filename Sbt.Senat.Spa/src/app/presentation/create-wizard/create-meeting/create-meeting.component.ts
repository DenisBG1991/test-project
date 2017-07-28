import {Location} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {FormGroup, Validators} from '@angular/forms';
import {NgRedux} from '@angular-redux/store';
import {BackNavigationService} from '@app/services/back-navigation.service';
import {ButtonType} from '@app/presentation/ui-kit/button/button.component';
import {IAppState} from '@app/store/store';
import {ICollegialBody} from '@app/store/collegial-body/collegial-body.model';
import {CollegialBodyActions} from '@app/store/collegial-body/collegial-body.actions';
import {IMeetingAbsentia, IMeetingPresentiaMultilingual, MeetingType} from '@app/store/meeting/meeting.model';
import {MeetingActions} from '@app/store/meeting/meeting.actions';
import {ValidationService} from '@app/services/validation.service';
import {PermissionEnum} from '@app/store/permission';
import {PermissionSelectors} from '@app/store/permission/permission.selectors';
import {Observable} from 'rxjs/Observable';
import {interval} from 'rxjs/observable/interval';

@Component({
    selector: 'senat-create-meeting',
    templateUrl: './create-meeting.component.html',
    styleUrls: ['./create-meeting.component.css']
})
export class CreateMeetingComponent implements OnInit {

    buttonType = ButtonType;

    presentia = true;

    absentiaFormGroup: FormGroup;
    presentiaFormGroup: FormGroup;

    //noinspection JSUnusedGlobalSymbols
    /**
     * Перечень комитетов для выбора.
     * @returns {Observable<S>}
     */
    collegialBodies$: Observable<Array<ICollegialBody>> = this._ngRedux
        .select(this._permissionSelectors.collegialBodyPermissionFilter(PermissionEnum.CreateMeeting));

    showLoadingIndicator$: Observable<boolean> = this._ngRedux
        .select(x => x.layout.meeting.absentiaMeetingBeingCreated || x.layout.meeting.presentiaMeetingBeingCreated);

    /**
     * Создаёт модель формы создания очного заседания.
     */
    static createPresentiaFormModel(): IMeetingPresentiaMultilingual {
        let tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        return {
            id: null,
            num: null,
            type: MeetingType.Presentia,
            state: null,
            collegialBody: null,
            agendaDueDate: new Date(tomorrow.getTime()),
            materialsDueDate: new Date(tomorrow.getTime()),
            date: new Date(tomorrow.getTime()),
            place: null,
            address: null,
            hasProtocol: false
        };
    }

    /**
     * Создаёт модель формы создания заочного заседания.
     */
    static createAbsentiaFormModel(): IMeetingAbsentia {
        let tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        return {
            id: null,
            num: null,
            type: MeetingType.Absentia,
            state: null,
            collegialBody: null,
            agendaDueDate: new Date(tomorrow.getTime()),
            materialsDueDate: new Date(tomorrow.getTime()),
            startDate: new Date(tomorrow.getTime()),
            endDate: new Date(tomorrow.getTime()),
            hasProtocol: false
        };
    }

    constructor(private _ngRedux: NgRedux<IAppState>,
                private _meetingActions: MeetingActions,
                private _collegialBodyActions: CollegialBodyActions,
                private _validationService: ValidationService,
                private  _permissionSelectors: PermissionSelectors,
                private _backNavigationService: BackNavigationService,
                private _location: Location) {
    }

    ngOnInit() {

        this._ngRedux.dispatch(this._collegialBodyActions.updateCollegialBodies());

        // в angular-redux/form нет поддержки reactive forms (FormGroup),
        // поэтому синхронизация делается вручную с помощью подписки на .valueChanges() формы
        // и с некоторым интервалом
        // начальное состояние (initial state) FormGroup в сторе - null, т.к. для создания формы нужен
        // экземпляр FormBuilder
        // иначе initial state уже не может быть объявлен константой, т.к. ему требуется зависимость
        this.subscribeToAbsentiaForm();
        this.subscribeToPresentiaForm();
    }

    subscribeToAbsentiaForm() {
        this._ngRedux.select(x => x.layout.createAbsentiaMeetingForm)
            .subscribe(form => {
                if (!form) {
                    this.absentiaFormGroup = this._validationService.createFormGroup(CreateMeetingComponent.createAbsentiaFormModel(),
                        [
                            {
                                propExpression: x => x.num,
                                validators: [
                                    Validators.required
                                ]
                            },
                            {
                                propExpression: x => x.collegialBody,
                                validators: [
                                    Validators.required
                                ]
                            }
                        ]);
                } else {
                    this.absentiaFormGroup = form;
                }

                this.absentiaFormGroup.valueChanges
                    .debounce(() => interval(300))
                    .subscribe(() => {
                        this._ngRedux.dispatch(this._meetingActions.createAbsentiaFormChanged(this.absentiaFormGroup));
                    });
            });
    }

    subscribeToPresentiaForm() {
        this._ngRedux.select(x => x.layout.createPresentiaMeetingForm)
            .subscribe(form => {
                if (!form) {
                    this.presentiaFormGroup = this._validationService.createFormGroup(CreateMeetingComponent.createPresentiaFormModel(),
                        [
                            {
                                propExpression: x => x.num,
                                validators: [
                                    Validators.required
                                ]
                            },
                            {
                                propExpression: x => x.collegialBody,
                                validators: [
                                    Validators.required
                                ]
                            }
                        ]);
                } else {
                    this.presentiaFormGroup = form;
                }

                this.presentiaFormGroup.valueChanges
                    .debounce(() => interval(300))
                    .subscribe(() => {
                        this._ngRedux.dispatch(this._meetingActions.createPresentiaFormChanged(this.presentiaFormGroup));
                    });
            });
    }

    submit(): void {
        if (this.presentia) {
            this._ngRedux.dispatch(this._meetingActions.createPresentiaMeeting(this.presentiaFormGroup));
        } else {
            this._ngRedux.dispatch(this._meetingActions.createAbsentiaMeeting(this.absentiaFormGroup));
        }
    }

    back() {
        this._location.back();
    }

    close() {
        this._backNavigationService.navigateBack(2);
    }
}
