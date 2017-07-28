import {IMeeting, IMeetingAbsentia, IMeetingPresentia} from '@app/store/meeting/meeting.model';
import {Injectable} from '@angular/core';
import {IMeetingsFilter} from '@app/store/meeting/meetings-filter.model';
import {IPage} from '@app/store/paging.model';
import {FormGroup} from '@angular/forms';
import {IMeetingRef} from '@app/store/meeting/meeting-ref.model';
import {MeetingWorkflowAction} from '@app/store/meeting/meeting-workflow-action';

@Injectable()
export class MeetingActions {
    static readonly UpdateMeetingsFilter = 'UPDATE_MEETINGS_FILTER';
    static readonly FetchMoreMeetings = 'FETCH_MORE_MEETINGS';

    static readonly LoadMeetingsPageComplete = 'LOAD_MEETINGS_PAGE_COMPLETE';
    static readonly LoadMeetingsPageFail = 'LOAD_MEETINGS_PAGE_FAIL';

    static readonly LoadSingleMeeting = 'LOAD_SINGLE_MEETING';
    static readonly LoadSingleMeetingComplete = 'LOAD_SINGLE_MEETING_COMPLETE';
    static readonly LoadSingleMeetingFail = 'LOAD_SINGLE_MEETING_FAIL';

    static readonly AbsentiaMeetingFormChanged = '(FORM_CHANGE)ABSENTIA_MEETING';
    static readonly PresentiaMeetingFormChanged = '(FORM_CHANGE)PRESENTIA_MEETING';

    static readonly CreatePresentiaFormChanged = '(FORM_CHANGE)CREATE_PRESENTIA_MEETING';
    static readonly CreateAbsentiaFormChanged = '(FORM_CHANGE)CREATE_ABSENTIA_MEETING';

    static readonly CreatePresentiaMeeting = 'CREATE_PRESENTIA_MEETING';
    static readonly CreateAbsentiaMeeting = 'CREATE_ABSENTIA_MEETING';
    static readonly CreatePresentiaMeetingComplete = 'CREATE_PRESENTIA_MEETING_COMPLETE';
    static readonly CreateAbsentiaMeetingComplete = 'CREATE_ABSENTIA_MEETING_COMPLETE';
    static readonly CreatePresentiaMeetingFail = 'CREATE_PRESENTIA_MEETING_FAIL';
    static readonly CreateAbsentiaMeetingFail = 'CREATE_ABSENTIA_MEETING_FAIL';

    static readonly MoveMeetingState = 'MOVE_MEETING_STATE';

    static readonly FormMeetingProtocol = 'FORM_MEETING_PROTOCOL';
    static readonly FormMeetingProtocolComplete = 'FORM_MEETING_PROTOCOL_COMPLETE';
    static readonly FormMeetingProtocolFail = 'FORM_MEETING_PROTOCOL_FAIL';

    static readonly EditMeeting = 'EDIT_MEETING';

    static readonly DeleteMeeting = 'DELETE_MEETING';
    static readonly DeleteMeetingComplete = 'DELETE_MEETING_COMPLETE';
    static readonly DeleteMeetingFail = 'DELETE_MEETING_FAIL';

    /**
     * Обновление фильтра заседаний.
     * @param filter
     * @returns {{type: string, payload: {filter: IMeetingsFilter}}}
     */
    updateMeetingsFilter(filter: IMeetingsFilter) {
        return {
            type: MeetingActions.UpdateMeetingsFilter,
            payload: {
                filter: filter
            }
        };
    }

    /**
     * Догрузка следующей страницы.
     * @returns {{type: string}}
     */
    fetchMoreMeetings() {
        return {
            type: MeetingActions.FetchMoreMeetings
        };
    }

    /**
     * Завершение загрузки страницы заседаний.
     */
    loadMeetingsPageComplete(page: IPage<IMeeting>) {
        return {
            type: MeetingActions.LoadMeetingsPageComplete,
            payload: {
                page: page
            }
        };
    }

    /**
     * Ошибка при загрузке страницы заседаний.
     */
    loadMeetingsPageFail(error) {
        return {
            type: MeetingActions.LoadMeetingsPageFail,
            payload: {
                error: error
            }
        };
    }

    loadSingleMeeting(ref: IMeetingRef) {
        return {
            type: MeetingActions.LoadSingleMeeting,
            payload: {
                meeting: ref
            }
        };
    }

    loadSingleMeetingComplete(meeting: IMeeting) {
        return {
            type: MeetingActions.LoadSingleMeetingComplete,
            payload: {
                meeting: meeting
            }
        };
    }

    loadSingleMeetingFail(error) {
        return {
            type: MeetingActions.LoadSingleMeetingFail,
            payload: {
                error: error
            }
        };
    }

    absentiaMeetingFormChanged(formGroup: FormGroup) {
        return {
            type: MeetingActions.AbsentiaMeetingFormChanged,
            payload: {
                formGroup: formGroup
            }
        };
    }

    presentiaMeetingFormChanged(formGroup: FormGroup) {
        return {
            type: MeetingActions.PresentiaMeetingFormChanged,
            payload: {
                formGroup: formGroup
            }
        };
    }

    /**
     * Изменение формы создания очного заседания.
     * @param formGroup
     * @returns {{type: string, payload: {formGroup: FormGroup}}}
     */
    createPresentiaFormChanged(formGroup: FormGroup) {
        return {
            type: MeetingActions.CreatePresentiaFormChanged,
            payload: {
                formGroup: formGroup
            }
        };
    }

    /**
     * Изменение формы создания заочного заседания.
     * @param formGroup
     * @returns {{type: string, payload: {formGroup: FormGroup}}}
     */
    createAbsentiaFormChanged(formGroup: FormGroup) {
        return {
            type: MeetingActions.CreateAbsentiaFormChanged,
            payload: {
                formGroup: formGroup
            }
        };
    }

    /**
     * Создать очное заседание.
     * @param formGroup
     * @returns {{type: string, payload: {formGroup: FormGroup}}}
     */
    createPresentiaMeeting(formGroup: FormGroup) {
        return {
            type: MeetingActions.CreatePresentiaMeeting,
            payload: {
                formGroup: formGroup
            }
        };
    }

    /**
     * Создать заочное заседание.
     * @param formGroup
     * @returns {{type: string, payload: {formGroup: FormGroup}}}
     */
    createAbsentiaMeeting(formGroup: FormGroup) {
        return {
            type: MeetingActions.CreateAbsentiaMeeting,
            payload: {
                formGroup: formGroup
            }
        };
    }

    /**
     * Создано заочное заседание.
     * @param meeting
     * @returns {{type: string, payload: {meeting: IMeetingAbsentia}}}
     */
    createAbsentiaMeetingComplete(meeting: IMeetingAbsentia) {
        return {
            type: MeetingActions.CreateAbsentiaMeetingComplete,
            payload: {
                meeting: meeting
            }
        };
    }

    /**
     * Создано очное заседание.
     * @param meeting
     * @returns {{type: string, payload: {meeting: IMeetingPresentia}}}
     */
    createPresentiaMeetingComplete(meeting: IMeetingPresentia) {
        return {
            type: MeetingActions.CreatePresentiaMeetingComplete,
            payload: {
                meeting: meeting
            }
        };
    }

    createAbsentiaMeetingFail(error) {
        return {
            type: MeetingActions.CreateAbsentiaMeetingFail,
            payload: {
                error: error
            }
        };
    }

    createPresentiaMeetingFail(error) {
        return {
            type: MeetingActions.CreatePresentiaMeetingFail,
            payload: {
                error: error
            }
        };
    }

    /**
     * Изменение статуса заседания.
     * @param meeting
     * @param action
     */
    moveMeetingState(meeting: IMeetingRef, action: MeetingWorkflowAction) {
        return {
            type: MeetingActions.MoveMeetingState,
            payload: {
                meeting: meeting,
                action: action
            }
        };
    }

    formMeetingProtocol(meeting: IMeetingRef) {
        return {
            type: MeetingActions.FormMeetingProtocol,
            payload: {
                meeting: meeting
            }
        };
    }

    formMeetingProtocolComplete(meeting: IMeetingRef) {
        return {
            type: MeetingActions.FormMeetingProtocolComplete,
            payload: {
                meeting: meeting
            }
        };
    }

    formMeetingProtocolFail(error) {
        return {
            type: MeetingActions.FormMeetingProtocolFail,
            payload: {
                error: error
            }
        };
    }

    editMeeting(formGroup: FormGroup) {
        return {
            type: MeetingActions.EditMeeting,
            payload: {
                formGroup: formGroup
            }
        };
    }

    deleteMeeting(meeting: IMeetingRef) {
        return {
            type: MeetingActions.DeleteMeeting,
            payload: {
                meeting: meeting
            }
        };
    }

    deleteMeetingComplete(meeting: IMeetingRef) {
        return {
            type: MeetingActions.DeleteMeetingComplete,
            payload: {
                meeting: meeting
            }
        };
    }

    deleteMeetingFail(error) {
        return {
            type: MeetingActions.DeleteMeetingFail,
            payload: {
                error: error
            }
        };
    }
}
