import {Pipe, PipeTransform} from '@angular/core';
import {IAgendaItemParticipant} from '@app/store/agenda-item-participants/agenda-item-participant.model';
import {AgendaItemParticipantRole} from '@app/store/agenda-item-participants/agenda-item-participant-role.model';
import {IPerson} from '@app/store/person/person.model';

@Pipe({
    name: 'agendaItemParticipantFilter'
})
export class AgendaItemParticipantFilterPipe implements PipeTransform {
    transform(value: Array<{ self: IAgendaItemParticipant, person: IPerson }>,
              roles: Array<AgendaItemParticipantRole>): Array<{ self: IAgendaItemParticipant, person: IPerson }> {
        return value.filter(x => x.self.roles.find(r => roles.find(rr => rr === r) != null) != null);
    }
}
