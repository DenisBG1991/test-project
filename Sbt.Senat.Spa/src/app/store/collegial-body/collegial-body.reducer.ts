import {ICollegialBody} from '@app/store/collegial-body/collegial-body.model';
import {CollegialBodyActions} from '@app/store/collegial-body/collegial-body.actions';
import {MeetingActions} from '@app/store/meeting/meeting.actions';

export function collegialBodyReducer(state: Array<ICollegialBody> = [], action): Array<ICollegialBody> {
    switch (action.type) {

        case CollegialBodyActions.UpdateCollegialBodiesComplete:
            return action.payload.collegialBodies;

        case MeetingActions.LoadMeetingsPageComplete:
            const newCollegialBodies: Array<ICollegialBody> = [];
            action.payload.page.items.map(x => x.collegialBody)
                .forEach(x => {
                    if (!newCollegialBodies.some(b => b.id === x.id)) {
                        newCollegialBodies.push(x);
                    }
                });
            return state
                .concat(newCollegialBodies.filter(f => !state.some(s => s.id === f.id)));

        case MeetingActions.LoadSingleMeetingComplete:
            return state
                .concat([action.payload.meeting.collegialBody].filter(f => f && !state.some(s => s.id === f.id)));

        default:
            return state;
    }
}
