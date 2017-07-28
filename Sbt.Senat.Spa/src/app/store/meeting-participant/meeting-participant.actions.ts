import {Injectable} from '@angular/core';
import {IMeetingRef} from '@app/store/meeting/meeting-ref.model';
import {IMeetingParticipant} from '@app/store/meeting-participant/meeting-participant.model';
import {IPerson} from '@app/store/person/person.model';

@Injectable()
export class MeetingParticipantActions {

    static readonly Ping = 'MEETINGS_PARTICIPANTS_PING';

    static readonly LoadMeetingParticipants = 'LOAD_MEETING_PARTICIPANTS';
    static readonly LoadMeetingParticipantsComplete = 'LOAD_MEETING_PARTICIPANTS_COMPLETE';
    static readonly LoadMeetingParticipantsFail = 'LOAD_MEETING_PARTICIPANTS_FAIL';

    static readonly AddInvitedPerson = 'ADD_MEETING_INVITED_PERSON';
    static readonly RemoveInvitedPerson = 'REMOVE_MEETING_INVITED_PERSON';
    static readonly RemoveInvitedPersonComplete = 'REMOVE_MEETING_INVITED_PERSON_COMPLETE';
    static readonly RemoveInvitedPersonFail = 'REMOVE_MEETING_INVITED_PERSON_FAIL';

    ping() {
        return {
            type: MeetingParticipantActions.Ping
        };
    }

    loadMeetingParticipants(meeting: IMeetingRef) {
        return {
            type: MeetingParticipantActions.LoadMeetingParticipants,
            payload: {
                meeting: meeting
            }
        };
    }

    loadMeetingParticipantsComplete(participants: Array<IMeetingParticipant>) {
        return {
            type: MeetingParticipantActions.LoadMeetingParticipantsComplete,
            payload: {
                participants: participants
            }
        };
    }

    loadMeetingParticipantsFail(error) {
        return {
            type: MeetingParticipantActions.LoadMeetingParticipantsFail,
            payload: {
                error: error
            }
        };
    }

    /**
     * Добавление приглашённого участника.
     * @param meeting
     * @param person
     * @returns {{type: string, payload: {meeting: IMeetingRef, person: IPerson}}}
     */
    addInvitedPerson(meeting: IMeetingRef, person: IPerson) {
        return {
            type: MeetingParticipantActions.AddInvitedPerson,
            payload: {
                meeting: meeting,
                person: person
            }
        };
    }

    /**
     * Удаление приглашённого участника
     * @param meeting
     * @param person
     * @returns {{type: string, payload: {meeting: IMeetingRef, person: IPerson}}}
     */
    removeInvitedPerson(meeting: IMeetingRef, person: IPerson) {
        return {
            type: MeetingParticipantActions.RemoveInvitedPerson,
            payload: {
                meeting: meeting,
                person: person
            }
        };
    }

    removeInvitedPersonComplete(meeting: IMeetingRef, person: IPerson) {
        return {
            type: MeetingParticipantActions.RemoveInvitedPersonComplete,
            payload: {
                meeting: meeting,
                person: person
            }
        };
    }

    removeInvitedPersonFail(error) {
        return {
            type: MeetingParticipantActions.RemoveInvitedPersonFail,
            payload: {
                error: error
            }
        };
    }
}
