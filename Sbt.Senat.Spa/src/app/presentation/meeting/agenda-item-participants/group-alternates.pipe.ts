import {Pipe, PipeTransform} from '@angular/core';
import {IPerson} from '@app/store/person/person.model';
import {IAgendaItemParticipant, IParticipant} from '@app/store/agenda-item-participants/agenda-item-participant.model';

import {AgendaItemParticipantRole} from '@app/store/agenda-item-participants/agenda-item-participant-role.model';
import {IMeetingParticipant} from '@app/store/meeting-participant/meeting-participant.model';
@Pipe({
    name: 'groupAlternates'
})
export class GroupAlternatesPipe implements PipeTransform {

    transform(value: Array<{ self: IAgendaItemParticipant, person: IPerson }>,
              role: AgendaItemParticipantRole,
              meetingParticipants: Array<IMeetingParticipant>,
              persons: Array<IPerson>): Array<{
        self: IAgendaItemParticipant,
        alternateParticipants: Array<IParticipant>,
        person: IPerson,
        alternates: Array<IPerson>
    }> {
        if (role === AgendaItemParticipantRole.CollegialBodyMember) {
            const ret = value.map(x => {
                const head = meetingParticipants.find(f => f.person.id === x.person.id);
                let alternates: Array<IParticipant> = null;
                if (head && head.alternates) {
                    alternates = head.alternates.map(al => {
                        return {
                            attendee: value.find(alt => alt.self.person.id === al.id),
                            meetingParticipant: al
                        }
                    })
                        .filter(f => !!f.attendee) // there are not attendees under this head person
                        .map(r => {
                            return {
                                person: {
                                    id: r.meetingParticipant.id
                                },
                                presents: r.attendee.self.presents
                            }
                        });

                    if (alternates.length === 0) {
                        alternates = null;
                    }
                }


                return {
                    self: x.self,
                    person: x.person,
                    alternateParticipants: alternates,
                    alternates: alternates ? persons.filter(p => alternates.some(al => al.person.id === p.id)) : null
                }
            });

            const preRet = ret.filter(f => !ret.some(at => !!at.alternateParticipants && at.alternateParticipants.some(alt => alt.person.id === f.self.person.id)));
            return preRet;
        } else {
            return value.map(x => {
                return {
                    self: x.self,
                    person: x.person,
                    alternates: null,
                    alternateParticipants: null
                }
            });
        }

    }

}
