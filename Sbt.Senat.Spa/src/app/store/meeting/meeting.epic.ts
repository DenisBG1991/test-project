import {Injectable} from '@angular/core';
import {MeetingActions} from '@app/store/meeting/meeting.actions';
import {MeetingService} from '@app/services/api/meeting.service';
import {IAppState} from '@app/store/store';
import {NgRedux} from '@angular-redux/store';
import 'rxjs/add/operator/debounce';
import {
    IMeetingAbsentia, IMeetingPresentia, IMeetingPresentiaMultilingual,
    MeetingType
} from '@app/store/meeting/meeting.model';
import {ValidationService} from '@app/services/validation.service';
import {Validators, FormGroup} from '@angular/forms';
import {MultilingualService} from '@app/presentation/localization/multilingual.service';
import {interval} from 'rxjs/observable/interval';
import {FormValidationException} from '@app/services/api/validation.error';
import {ErrorActions} from '@app/store/error/error.actions';
import {Observable} from 'rxjs/Observable';
import 'rxjs/observable/concat';
import 'rxjs/observable/of';

@Injectable()
export class MeetingEpics {

    constructor(private _meetingService: MeetingService,
                private _meetingActions: MeetingActions,
                private _store: NgRedux<IAppState>,
                private _validationService: ValidationService,
                private _multilingualService: MultilingualService,
                private _errorActions: ErrorActions) {
    }

    /**
     * Обновление списка заседаний (загрузка первой страницы).
     * @param action$
     */
    reloadMeetings = (action$) => action$
        .ofType(MeetingActions.UpdateMeetingsFilter)
        .switchMap(action => {
            const paging = this._store.getState().meetings.paging;

            return this._meetingService.getMeetings(action.payload.filter,
                {
                    pageNum: 1,
                    pageSize: paging.pageSize
                })
                .debounce(() => interval(400))
                .map(page => this._meetingActions.loadMeetingsPageComplete(page))
                .catch(error => Observable.concat(
                    Observable.of(this._meetingActions.loadMeetingsPageFail(error)),
                    Observable.of(this._errorActions.errorOccurred(error))
                ));
        })

    /**
     * Загрузка следующей страницы списка заседаний.
     * @param action$
     */
    appendMeetings = (action$) => action$
        .ofType(MeetingActions.FetchMoreMeetings)
        .switchMap(() => {
            const filtering = this._store.getState().meetings.filter;
            const paging = this._store.getState().meetings.paging;

            return this._meetingService.getMeetings(filtering,
                {
                    pageNum: paging.currentPage + 1,
                    pageSize: paging.pageSize
                })
                .map(page => this._meetingActions.loadMeetingsPageComplete(page))
                .catch(error => Observable.concat(
                    Observable.of(this._meetingActions.loadMeetingsPageFail(error)),
                    Observable.of(this._errorActions.errorOccurred(error))
                ));
        })

    /**
     * Загрузка отдельного заседания.
     * @param action$
     */
    loadSingleMeeting = (action$) => action$
        .ofType(MeetingActions.LoadSingleMeeting) // при загрузке отдельного заседания
        .switchMap(action => this._meetingService.getMeeting(action.payload.meeting) // обращаемся к API
            .switchMap(meeting => {
                // результатом вызова API будет заседание со всеми переводами (address и place будут иметь тип {[key: string]: string})
                if (meeting.type === MeetingType.Absentia) {
                    // создаём форму из модели заседания
                    const meetingAbsentia: IMeetingAbsentia = meeting as IMeetingAbsentia;
                    const formGroup = this._validationService.createFormGroup(meetingAbsentia, [
                        {
                            propExpression: m => m.num,
                            validators: [
                                Validators.required
                            ]
                        }
                    ]);

                    // редактировании collegialBody запрещено
                    // TODO: расшинить ValidationService.createFormGroup для поддержки disabled
                    formGroup.get('collegialBody').disable();

                    // возвращаем 2 экшена
                    // один добавит заседание в список
                    // второй обновит layout-state
                    return Observable.concat(
                        Observable.of(this._meetingActions.loadSingleMeetingComplete(meetingAbsentia)),
                        Observable.of(this._meetingActions.absentiaMeetingFormChanged(formGroup))
                    );

                } else {
                    const meetingPresentia: IMeetingPresentiaMultilingual = meeting as IMeetingPresentiaMultilingual;
                    const formGroup = this._validationService.createFormGroup(meetingPresentia, [
                        {
                            propExpression: m => m.num,
                            validators: [
                                Validators.required
                            ]
                        }
                    ]);

                    // редактировании collegialBody запрещено
                    formGroup.get('collegialBody').disable();

                    // очное заседание содержит переводы, которые нужны для формы,
                    // но не нужны для коллекции meetings
                    // выполняем локализацию
                    const meetingCloned = JSON.parse(JSON.stringify(meetingPresentia));

                    meetingCloned.address = this._multilingualService.getTranslation(meetingCloned.address);
                    meetingCloned.place = this._multilingualService.getTranslation(meetingCloned.place);

                    const meetingLocalized = meetingCloned as IMeetingPresentia;

                    // возвращаем 2 экшена
                    // один добавит заседание в список
                    // второй обновит layout-state
                    return Observable.concat(
                        Observable.of(this._meetingActions.loadSingleMeetingComplete(meetingLocalized)),
                        Observable.of(this._meetingActions.presentiaMeetingFormChanged(formGroup))
                    );
                }
            })
            .catch(error => Observable.concat(
                Observable.of(this._meetingActions.loadSingleMeetingFail(error)),
                Observable.of(this._errorActions.errorOccurred(error))
            )))

    /**
     * Создание заочного заседания.
     * @param action$
     */
    createAbsentiaMeeting = action$ => action$
        .ofType(MeetingActions.CreateAbsentiaMeeting)
        .switchMap(action => {
            const formGroup: FormGroup = action.payload.formGroup;
            const meetingAbsentia: IMeetingAbsentia = formGroup.value;

            return this._meetingService.createAbsentiaMeeting(meetingAbsentia)
                .map(meetingCreated => this._meetingActions.createAbsentiaMeetingComplete(meetingCreated))
                .catch(error => {
                    if (error instanceof FormValidationException) {
                        this._validationService.registerErrors(action.payload.formGroup, error);

                        return Observable.concat(
                            Observable.of(this._meetingActions.absentiaMeetingFormChanged(action.payload.formGroup)),
                            Observable.of(this._meetingActions.createAbsentiaMeetingFail(error))
                        );
                    }

                    return Observable.concat(
                        Observable.of(this._meetingActions.createAbsentiaMeetingFail(error)),
                        Observable.of(this._errorActions.errorOccurred(error))
                    );
                });
        })

    /**
     * Создание очного заседания.
     * @param action$
     */
    createPresentiaMeeting = action$ => action$
        .ofType(MeetingActions.CreatePresentiaMeeting)
        .switchMap(action => this._meetingService.createPresentiaMeeting(action.payload.formGroup.value)
            .map(meetingCreated => {

                // очное заседание содержит переводы, которые нужны для формы,
                // но не нужны для коллекции meetings
                // выполняем локализацию
                const meetingCloned = JSON.parse(JSON.stringify(meetingCreated));

                meetingCloned.address = this._multilingualService.getTranslation(meetingCloned.address);
                meetingCloned.place = this._multilingualService.getTranslation(meetingCloned.place);

                const meetingLocalized = meetingCloned as IMeetingPresentia;

                return this._meetingActions.createPresentiaMeetingComplete(meetingLocalized);
            })
            .catch(error => {
                if (error instanceof FormValidationException) {
                    this._validationService.registerErrors(action.payload.formGroup, error);

                    return Observable.concat(
                        Observable.of(this._meetingActions.presentiaMeetingFormChanged(action.payload.formGroup)),
                        Observable.of(this._meetingActions.createPresentiaMeetingFail(error))
                    );
                }

                return Observable.concat(
                    Observable.of(this._meetingActions.createPresentiaMeetingFail(error)),
                    Observable.of(this._errorActions.errorOccurred(error))
                );
            }))

    moveMeetingState = action$ => action$
        .ofType(MeetingActions.MoveMeetingState)
        .switchMap(action => this._meetingService.moveMeetingState(action.payload.meeting, action.payload.action)
            .switchMap(meeting => {
                // результатом вызова API будет заседание со всеми переводами (address и place будут иметь тип {[key: string]: string})
                if (meeting.type === MeetingType.Absentia) {
                    // создаём форму из модели заседания
                    const meetingAbsentia: IMeetingAbsentia = meeting as IMeetingAbsentia;
                    const formGroup = this._validationService.createFormGroup(meetingAbsentia, [
                        {
                            propExpression: m => m.num,
                            validators: [
                                Validators.required
                            ]
                        }
                    ]);

                    // редактировании collegialBody запрещено
                    // TODO: расшинить ValidationService.createFormGroup для поддержки disabled
                    formGroup.get('collegialBody').disable();

                    // возвращаем 2 экшена
                    // один добавит заседание в список
                    // второй обновит layout-state
                    return Observable.concat(
                        Observable.of(this._meetingActions.loadSingleMeetingComplete(meetingAbsentia)),
                        Observable.of(this._meetingActions.absentiaMeetingFormChanged(formGroup))
                    );

                } else {
                    const meetingPresentia: IMeetingPresentiaMultilingual = meeting as IMeetingPresentiaMultilingual;
                    const formGroup = this._validationService.createFormGroup(meetingPresentia, [
                        {
                            propExpression: m => m.num,
                            validators: [
                                Validators.required
                            ]
                        }
                    ]);

                    // редактировании collegialBody запрещено
                    formGroup.get('collegialBody').disable();

                    // очное заседание содержит переводы, которые нужны для формы,
                    // но не нужны для коллекции meetings
                    // выполняем локализацию
                    const meetingCloned = JSON.parse(JSON.stringify(meetingPresentia));

                    meetingCloned.address = this._multilingualService.getTranslation(meetingCloned.address);
                    meetingCloned.place = this._multilingualService.getTranslation(meetingCloned.place);

                    const meetingLocalized = meetingCloned as IMeetingPresentia;

                    // возвращаем 2 экшена
                    // один добавит заседание в список
                    // второй обновит layout-state
                    return Observable.concat(
                        Observable.of(this._meetingActions.loadSingleMeetingComplete(meetingLocalized)),
                        Observable.of(this._meetingActions.presentiaMeetingFormChanged(formGroup))
                    );
                }
            })
            .catch(error => Observable.of(this._errorActions.errorOccurred(error))))

    formMeetingProtocol = action$ => action$
        .ofType(MeetingActions.FormMeetingProtocol)
        .switchMap(action => {
            return this._meetingService.formMeetingProtocol(action.payload.meeting)
                .mergeMap(meetingCreated => Observable.concat(
                    Observable.of(this._meetingActions.formMeetingProtocolComplete(action.payload.meeting)),
                    Observable.of(this._meetingActions.loadMeetingProtocol(action.payload.meeting))))
                .catch(error => Observable.concat(
                    Observable.of(this._meetingActions.formMeetingProtocolFail(error)),
                    Observable.of(this._errorActions.errorOccurred(error))
                ));
        })
    editMeeting = action$ => action$
        .ofType(MeetingActions.EditMeeting)
        .switchMap(action => this._meetingService.editMeeting(action.payload.formGroup.value)
            .map(meeting => {
                if (meeting.type === MeetingType.Presentia) {
                    const meetingPresentia = meeting as IMeetingPresentia;
                    // очное заседание содержит переводы, которые нужны для формы,
                    // но не нужны для коллекции meetings
                    // выполняем локализацию
                    const meetingCloned = JSON.parse(JSON.stringify(meeting));

                    meetingCloned.address = this._multilingualService.getTranslation(meetingPresentia.address);
                    meetingCloned.place = this._multilingualService.getTranslation(meetingPresentia.place);

                    const meetingLocalized = meetingCloned as IMeetingPresentia;

                    return this._meetingActions.loadSingleMeetingComplete(meetingLocalized);
                } else {
                    const meetingAbsentia: IMeetingAbsentia = meeting as IMeetingAbsentia;
                    return this._meetingActions.loadSingleMeetingComplete(meetingAbsentia);
                }
            })
            .catch(error => {
                if (error instanceof FormValidationException) {
                    this._validationService.registerErrors(action.payload.formGroup, error);

                    if (action.payload.meeting.type === MeetingType.Absentia) {
                        return Observable.of(this._meetingActions.absentiaMeetingFormChanged(action.payload.formGroup) as any);
                    } else {
                        return Observable.of(this._meetingActions.presentiaMeetingFormChanged(action.payload.formGroup) as any);
                    }
                }

                return Observable.concat(
                    Observable.of(this._meetingActions.loadSingleMeetingFail(error)),
                    Observable.of(this._errorActions.errorOccurred(error))
                );
            }))

    deleteMeeting = (action$) => action$
        .ofType(MeetingActions.DeleteMeeting)
        .switchMap(action => this._meetingService.delete(action.payload.meeting)
            .map(() => this._meetingActions.deleteMeetingComplete(action.payload.meeting))
            .catch(error => Observable.concat(
                Observable.of(this._meetingActions.deleteMeetingFail(error)),
                Observable.of(this._errorActions.errorOccurred(error))
            )));
}
