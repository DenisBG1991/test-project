import {Pipe, PipeTransform} from '@angular/core';
import {MeetingParticipantRole} from '@app/store/meeting-participant/meeting-participant-role.model';

@Pipe({
    name: 'meetingParticipantRoles'
})
export class MeetingParticipantRoleFilterPipe implements PipeTransform {
    transform(value: Array<MeetingParticipantRole>, roles: Array<MeetingParticipantRole>): Array<MeetingParticipantRole> {
        return value.filter(r => roles.find(rr => rr === r) != null);
    }
}
