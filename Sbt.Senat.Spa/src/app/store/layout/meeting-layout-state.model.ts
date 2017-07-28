export interface IMeetingLayoutState {
    editMode: boolean;
    absentiaMeetingBeingCreated: boolean;
    presentiaMeetingBeingCreated: boolean;
}

export const meetingLayoutInitialState: IMeetingLayoutState = {
    editMode: false,
    absentiaMeetingBeingCreated: false,
    presentiaMeetingBeingCreated: false
};
