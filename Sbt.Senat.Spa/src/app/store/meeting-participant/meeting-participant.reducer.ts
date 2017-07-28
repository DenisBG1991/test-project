import {IMeetingParticipant} from '@app/store/meeting-participant/meeting-participant.model';
import {MeetingParticipantActions} from '@app/store/meeting-participant/meeting-participant.actions';
import {MeetingParticipantRole} from '@app/store/meeting-participant/meeting-participant-role.model';

export function meetingParticipantReducer(state: Array<IMeetingParticipant> = [], action): Array<IMeetingParticipant> {
    switch (action.type) {
        case MeetingParticipantActions.Ping:
            return state.concat([]);
        case MeetingParticipantActions.LoadMeetingParticipantsComplete:
            return state.filter(x => action.payload.participants
                .find(p => p.person.id === x.person.id && p.meeting.id === x.meeting.id) == null)
                .concat(action.payload.participants);

        case MeetingParticipantActions.RemoveInvitedPersonComplete:
            const participant = state.find(p => p.person.id === action.payload.person.id && p.meeting.id === action.payload.meeting.id);

            if (participant.roles.length > 1) {

                participant.roles = participant.roles.filter(r => r !== MeetingParticipantRole.InvitedPerson);

                return state.filter(x => x.meeting.id !== action.payload.meeting.id || x.person.id !== action.payload.person.id)
                    .concat(participant);
            }

            return state.filter(x => x.meeting.id !== action.payload.meeting.id || x.person.id !== action.payload.person.id);

        default:
            return state;
    }
}
