import {IPersonRef} from '@app/store/person/person.model';
import {MeetingParticipantRole} from '@app/store/meeting-participant/meeting-participant-role.model';
import {IMeetingRef} from '@app/store/meeting/meeting-ref.model';

export interface IMeetingParticipant {
    meeting: IMeetingRef;
    person: IPersonRef;
    roles: MeetingParticipantRole[];
    alternates: IPersonRef[];
}
