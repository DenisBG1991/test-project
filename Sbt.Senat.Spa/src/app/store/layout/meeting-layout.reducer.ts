import {IMeetingLayoutState, meetingLayoutInitialState} from '@app/store/layout/meeting-layout-state.model';
import {MeetingActions} from '@app/store/meeting/meeting.actions';
import {MeetingLayoutActions} from '@app/store/layout/meeting-layout.actions';

export function meetingLayoutReducer(state: IMeetingLayoutState = meetingLayoutInitialState, action): IMeetingLayoutState {
    switch (action.type) {
        case MeetingActions.LoadSingleMeetingComplete:
            return {
                editMode: false,
                absentiaMeetingBeingCreated: state.absentiaMeetingBeingCreated,
                presentiaMeetingBeingCreated: state.presentiaMeetingBeingCreated,
                openedVersionMaterialId: state.openedVersionMaterialId,
                loadingVersionMaterialId: state.loadingVersionMaterialId
            };

        case MeetingLayoutActions.ChangeMeetingLayoutEditMode:
            return {
                editMode: action.payload.editMode,
                absentiaMeetingBeingCreated: state.absentiaMeetingBeingCreated,
                presentiaMeetingBeingCreated: state.presentiaMeetingBeingCreated,
                openedVersionMaterialId: state.openedVersionMaterialId,
                loadingVersionMaterialId: state.loadingVersionMaterialId
            };

        case MeetingActions.CreateAbsentiaMeeting:
            return {
                editMode: action.payload.editMode,
                absentiaMeetingBeingCreated: true,
                presentiaMeetingBeingCreated: state.presentiaMeetingBeingCreated,
                openedVersionMaterialId: state.openedVersionMaterialId,
                loadingVersionMaterialId: state.loadingVersionMaterialId
            };

        case MeetingActions.CreateAbsentiaMeetingComplete:
            return {
                editMode: action.payload.editMode,
                absentiaMeetingBeingCreated: false,
                presentiaMeetingBeingCreated: state.presentiaMeetingBeingCreated,
                openedVersionMaterialId: state.openedVersionMaterialId,
                loadingVersionMaterialId: state.loadingVersionMaterialId
            };

        case MeetingActions.CreateAbsentiaMeetingFail:
            return {
                editMode: action.payload.editMode,
                absentiaMeetingBeingCreated: false,
                presentiaMeetingBeingCreated: state.presentiaMeetingBeingCreated,
                openedVersionMaterialId: state.openedVersionMaterialId,
                loadingVersionMaterialId: state.loadingVersionMaterialId
            };

        case MeetingActions.CreatePresentiaMeeting:
            return {
                editMode: action.payload.editMode,
                absentiaMeetingBeingCreated: state.absentiaMeetingBeingCreated,
                presentiaMeetingBeingCreated: true,
                openedVersionMaterialId: state.openedVersionMaterialId,
                loadingVersionMaterialId: state.loadingVersionMaterialId
            };

        case MeetingActions.CreatePresentiaMeetingComplete:
            return {
                editMode: action.payload.editMode,
                absentiaMeetingBeingCreated: state.absentiaMeetingBeingCreated,
                presentiaMeetingBeingCreated: false,
                openedVersionMaterialId: state.openedVersionMaterialId,
                loadingVersionMaterialId: state.loadingVersionMaterialId
            };

        case MeetingActions.CreatePresentiaMeetingFail:
            return {
                editMode: action.payload.editMode,
                absentiaMeetingBeingCreated: state.absentiaMeetingBeingCreated,
                presentiaMeetingBeingCreated: false,
                openedVersionMaterialId: state.openedVersionMaterialId,
                loadingVersionMaterialId: state.loadingVersionMaterialId
            };

        default:
            return state;
    }
}
