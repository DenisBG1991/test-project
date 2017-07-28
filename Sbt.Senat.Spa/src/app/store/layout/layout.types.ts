import {PermissionEnumDto} from '@app/shared/api'; // TODO: убрать
import {FormGroup} from '@angular/forms';
import {IMeetingLayoutState} from '@app/store/layout/meeting-layout-state.model';
import {IAgendaItemLayoutState} from '@app/store/layout/agenda-item-layout-state.model';

export interface ILayoutState {
    login: ILoginLayoutState;
    issue: IIssueLayoutState;
    meeting: IMeetingLayoutState;
    agendaItem: IAgendaItemLayoutState;
    controls: IControlsLayoutState;
    createPresentiaMeetingForm: FormGroup;
    createAbsentiaMeetingForm: FormGroup;
    meetingPresentiaForm: FormGroup;
    meetingAbsentiaForm: FormGroup;
    createIssueForm: FormGroup;
}

export  interface  IIssueLayoutState {
    editMode: boolean;
    permissions: PermissionEnumDto[];
    openedVersionMaterialId: string;
    loadingVersionMaterialId: string;
    issueBeingCreated: boolean;
}

export const issueLayoutInitialState: IIssueLayoutState = {
    editMode: false,
    permissions: [],
    openedVersionMaterialId: null,
    loadingVersionMaterialId: null,
    issueBeingCreated: false
};

export interface ILoginLayoutState {
    loginInProgress: boolean;
    error?;
}

export interface ILoginLayoutState {
    loginInProgress: boolean;
    error?;
}

export const loginLayoutInitialState: ILoginLayoutState = {
    loginInProgress: false
};

export interface IControlsLayoutState {
    itemsShown: boolean;
}

export const controlsLayoutInitialState: IControlsLayoutState = {
    itemsShown: false
};
