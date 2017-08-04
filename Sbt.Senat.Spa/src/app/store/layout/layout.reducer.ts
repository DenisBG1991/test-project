import {
    controlsLayoutInitialState, IControlsLayoutState, IIssueLayoutState, ILoginLayoutState, issueLayoutInitialState,
    loginLayoutInitialState, MaterialsUploadingLayoutState
} from '@app/store/layout/layout.types';
import {SessionActions} from '@app/store/session/session.actions';
import {ControlsLayoutActions} from '@app/store/layout/layout.actions';
import {IssueActions} from '@app/store/issue';
import {MaterialVersionActions} from '@app/store/material-version/material-version.actions';

export function loginLayoutReducer(state: ILoginLayoutState = loginLayoutInitialState, action): ILoginLayoutState {
    switch (action.type) {

        case SessionActions.Login:
            return {
                loginInProgress: true
            };

        case SessionActions.LoginComplete:
            return {
                loginInProgress: false
            };

        case SessionActions.LoginFail:
            return {
                error: action.payload.error,
                loginInProgress: false
            };

        default:
            return state;
    }
}

export function issueLayoutReducer(state: IIssueLayoutState = issueLayoutInitialState, action): IIssueLayoutState {
    switch (action.type) {

        case IssueActions.ChangeIssueEditMode:
            return {
                editMode: action.payload.editMode,
                permissions: state.permissions,
                openedVersionMaterialId: state.openedVersionMaterialId,
                loadingVersionMaterialId: state.loadingVersionMaterialId,
                issueBeingCreated: state.issueBeingCreated
            };

        case IssueActions.LoadIssueComplete:
            return {
                editMode: false,
                permissions: action.payload.permissions,
                openedVersionMaterialId: state.openedVersionMaterialId,
                loadingVersionMaterialId: state.loadingVersionMaterialId,
                issueBeingCreated: state.issueBeingCreated
            };

        case  IssueActions.UpdateIssueComplete:
            return {
                editMode: false,
                permissions: state.permissions,
                openedVersionMaterialId: state.openedVersionMaterialId,
                loadingVersionMaterialId: state.loadingVersionMaterialId,
                issueBeingCreated: state.issueBeingCreated
            };

        case IssueActions.CreateIssue:
            return {
                editMode: false,
                permissions: state.permissions,
                openedVersionMaterialId: state.openedVersionMaterialId,
                loadingVersionMaterialId: state.loadingVersionMaterialId,
                issueBeingCreated: true
            };

        case IssueActions.CreateIssueComplete:
            return {
                editMode: false,
                permissions: state.permissions,
                openedVersionMaterialId: state.openedVersionMaterialId,
                loadingVersionMaterialId: state.loadingVersionMaterialId,
                issueBeingCreated: false
            };

        case IssueActions.CreateIssueFail:
            return {
                editMode: false,
                permissions: state.permissions,
                openedVersionMaterialId: state.openedVersionMaterialId,
                loadingVersionMaterialId: state.loadingVersionMaterialId,
                issueBeingCreated: false
            };

        default:
            return state;
    }
}

export function materialsUploadingReducer(state: Array<MaterialsUploadingLayoutState> = [], action): Array<MaterialsUploadingLayoutState> {
    switch (action.type) {
        case MaterialVersionActions.IssueMaterialUploadProgress:
            let newupload = state
                .filter(f => f.upload && f.upload.file !== action.payload.upload.file);

            if (action.payload.upload.progress >= 0) {
                newupload = newupload.concat(action.payload);
            }
            return newupload;
        default:
            return state;
    }
}

export function controlsLayoutReducer(state: IControlsLayoutState = controlsLayoutInitialState, action): IControlsLayoutState {
    switch (action.type) {
        case ControlsLayoutActions.ToggleItems:
            return {
                itemsShown: !state.itemsShown
            };

        default:
            return state;
    }
}
