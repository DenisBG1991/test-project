import {MeetingActions} from '@app/store/meeting/meeting.actions';
import {IMeetingMaterial} from '@app/store/meeting-material/meeting-material.model';
import {MaterialVersionActions} from '@app/store/material-version/material-version.actions';

export function meetingMaterialReducer(state: Array<IMeetingMaterial> = [], action) {
    switch (action.type) {

        case MeetingActions.LoadMeetingProtocolComplete:
            return state.filter(m => action.payload.material.meeting.id === m.meeting.id
            && action.payload.material.id !== m.id)
                .concat([action.payload.material]);

        case MaterialVersionActions.LoadMaterialVersionsComplete:

            state.forEach(m => {
                const version = action.payload.versions.find(v => v.id === m.id);
                if (version && version.num > m.currentVersion.num) {
                    m.currentVersion = {
                        id: version.id,
                        num: version.num
                    };
                }
            });

            return state;
        default:
            return state;
    }
}
