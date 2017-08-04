export interface IMeetingLayoutState {
    editMode: boolean;
    absentiaMeetingBeingCreated: boolean;
    presentiaMeetingBeingCreated: boolean;
    openedVersionMaterialId: string;
    loadingVersionMaterialId: string;
}

export const meetingLayoutInitialState: IMeetingLayoutState = {
    editMode: false,
    absentiaMeetingBeingCreated: false,
    presentiaMeetingBeingCreated: false,
    openedVersionMaterialId: null,
    loadingVersionMaterialId: null
};
