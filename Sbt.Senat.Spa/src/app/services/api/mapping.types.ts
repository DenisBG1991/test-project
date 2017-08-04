import {IPerson, IPersonRef} from '@app/store/person/person.model';
import {AgendaItemStatus} from '@app/store/agenda-item/agenda-item-status.model';
import {IAgendaItem, IAgendaItemIdRef, IAgendaItemRef} from '@app/store/agenda-item/agenda-item.model';
import {IAgendaItemParticipant, IParticipant} from '@app/store/agenda-item-participants/agenda-item-participant.model';
import {AgendaItemParticipantRole} from '@app/store/agenda-item-participants/agenda-item-participant-role.model';
import {IIssueRef} from '@app/store/issue';
import {IMeetingParticipant} from '@app/store/meeting-participant/meeting-participant.model';
import {MeetingParticipantRole} from '@app/store/meeting-participant/meeting-participant-role.model';
import {IAgenda} from '@app/store/agenda/agenda.model';
import {IMeetingRef} from '@app/store/meeting/meeting-ref.model';
import {
    IMeetingAbsentia,
    IMeetingPresentia,
    IMeetingPresentiaMultilingual,
    MeetingType
} from '@app/store/meeting/meeting.model';
import {ICollegialBody} from '@app/store/collegial-body/collegial-body.model';
import {IIssueMaterialFolder} from '@app/store/issue-material-folder/issue-material-folder.model';
import {IMaterialVersion, IMaterialVersionRef} from '@app/store/material-version/material-version.model';
import {IIssueMaterial} from '@app/store/issue-material/issue-material.model';
import {IssueMaterialType, MeetingMaterialType} from '@app/store/material/material-type.model';
import {IVoting, IVotingRef} from '@app/store/voting/voting.model';
import {IVote} from '@app/store/vote/vote.model';
import {VoteType} from '@app/store/vote/vote-type.model';
import {MeetingStatus} from '@app/store/meeting/meeting-status';
import {ICompanyRef} from '@app/store/company/company.model';
import {IHoldingRef} from '@app/store/holding/holding.model';
import {IDecision, IDecisionApproval} from '@app/store/decision/decision.model';
import {IAgendaItemMaterialFolder} from '@app/store/agenda-item-material-folder/agenda-item-material-folder.model';
import {IMaterialFolder} from '@app/store/material/material-folder.model';
import {IMaterial} from '@app/store/material';
import {IAgendaItemMaterial} from '@app/store/agenda-item-material/agenda-item-material.model';
import {IMeetingMaterial} from '@app/store/meeting-material/meeting-material.model';

export class Agenda implements IAgenda {
    meeting: IMeetingRef;

    static parse(dto): Agenda {
        if (!dto) {
            return null;
        }

        const agenda = new Agenda();

        agenda.meeting = MeetingRef.parse(dto);

        return agenda;
    }
}

export class AgendaItem implements IAgendaItem {
    id: string;
    meeting: IMeetingRef;
    issue: IIssueRef;
    title: string;
    description: string;
    order: number;
    status: AgendaItemStatus;
    approval: IDecisionApproval;

    static parse(dto): AgendaItem {
        if (!dto) {
            return null;
        }

        const item = new AgendaItem();
        item.id = dto.id;
        item.issue = {
            id: dto.issue.id
        };
        if (dto.meeting) {
            item.meeting = {
                id: dto.meeting.id
            };
        }
        item.order = dto.order;
        if (dto.issue.title) { // парсинг от старого сервиса
            item.status = dto.state;
            item.title = dto.issue.title;
            item.description = dto.issue.description;
            item.approval = DecisionApproval.parse(dto.approval);
        } else { // парсинг от сервиса v2.0
            item.status = dto.status;
            item.title = dto.title;
            item.description = dto.description;
        }
        return item;
    }
}

export class AgendaItemParticipant implements IAgendaItemParticipant {
    agendaItem: IAgendaItemRef;
    agendaItemId: IAgendaItemIdRef;
    person: IPersonRef;
    roles: AgendaItemParticipantRole[];
    presents: boolean;
    alternates: Array<IParticipant>;

    static parse(dto): AgendaItemParticipant {
        if (!dto) {
            return null;
        }

        const participant = new AgendaItemParticipant();

        participant.person = {
            id: dto.id
        };
        participant.presents = dto.presents;
        participant.roles = dto.roles.map(r => AgendaItemParticipantRole[r.toString()]);
        participant.alternates = null;

        // participant.alternates = dto.alternates ? dto.alternates.map(r => Participant.parse(r)) : null;
        return participant;
    }
}

export class Participant implements IParticipant {

    person: IPersonRef;
    presents: boolean;

    static parse(dto): Participant {
        if (!dto) {
            return null;
        }
        const participant = new Participant();
        participant.person = {
            id: dto.id
        };
        participant.presents = dto.presents;

        return participant;
    }
}

export class CollegialBody implements ICollegialBody {
    id: string;
    name: string;
    company: ICompanyRef;
    holding: IHoldingRef;

    static parse(dto): CollegialBody {
        const collegialBody = new CollegialBody();

        collegialBody.id = dto.id;
        collegialBody.name = dto.name;
        collegialBody.company = (dto.company ? {
            id: dto.company.id
        } : null);
        collegialBody.holding = (dto.holding ? {
            id: dto.holding.id
        } : null);
        return collegialBody;
    }
}

export class DecisionApproval implements IDecisionApproval {
    approvingPerson: IPerson;
    approved: boolean;
    approvedAt: Date;

    static parse(dto): IDecisionApproval {
        if (!dto || !dto.approvingPerson) {
            return null;
        }

        const decisionApproval = new DecisionApproval();
        decisionApproval.approvingPerson = Person.parse(dto.approvingPerson);
        decisionApproval.approved = dto.approved;
        decisionApproval.approvedAt = dto.approvedAt;

        return decisionApproval;
    }
}

export class Decision implements IDecision {
    id: string;
    materialVersion: IMaterialVersionRef;
    meeting: IMeetingRef;
    issue: IIssueRef;
    accepted: boolean;
    approval: IDecisionApproval

    static parse(dto): Decision {
        if (!dto) {
            return null;
        }

        const decision = new Decision();
        decision.id = dto.id;
        decision.meeting = {
            id: dto.meeting.id
        }
        decision.issue = {
            id: dto.issue.id
        }
        decision.materialVersion = MaterialVersionRef.parse(dto.decisionProjectVersion);
        decision.accepted = dto.type === 'Accepted';

        decision.approval = DecisionApproval.parse(dto.approval);

        return decision;
    }
}

export abstract class MaterialFolder implements IMaterialFolder {

    name: string;
    location: string;

    static parse<T extends IMaterialFolder>(dto, c: new () => T): T {
        if (!dto) {
            return null;
        }

        const folder = new c();
        folder.name = dto.name;
        folder.location = dto.location !== undefined ? dto.location + '\\' : undefined;

        return folder;
    }
}

export class IssueMaterialFolder extends MaterialFolder implements IIssueMaterialFolder {
    issue: IIssueRef;

    static parse(dto): IssueMaterialFolder {
        return MaterialFolder.parse(dto, IssueMaterialFolder);
    }
}

export class AgendaItemMaterialFolder extends MaterialFolder implements IAgendaItemMaterialFolder {
    agendaItem: IAgendaItemIdRef;
    issue: IIssueRef;
    meeting: IMeetingRef;

    static parse(dto): AgendaItemMaterialFolder {
        return MaterialFolder.parse(dto, AgendaItemMaterialFolder);
    }
}

export abstract class TypedMaterial implements IMaterial {

    id: string;
    location: string;
    currentVersion: IMaterialVersionRef;

    static parse<T extends IMaterial>(dto, c: new () => T): T {
        if (!dto) {
            return null;
        }

        const material = new c();

        material.id = dto.id;
        material.location = dto.location !== undefined ? dto.location + '\\' : undefined;
        material.currentVersion = {
            id: dto.id,
            num: dto.currentVersion.num || dto.currentVersion.version
        };

        return material;
    }

}

export class IssueMaterial extends TypedMaterial implements IIssueMaterial {
    issue: IIssueRef;
    type: IssueMaterialType;

    static parse(dto): IssueMaterial {
        const material =  TypedMaterial.parse(dto, IssueMaterial);
        material.type = dto.category || dto.type;
        return material;
    }
}

export class MeetingMaterial extends TypedMaterial implements IMeetingMaterial {
    meeting: IMeetingRef;
    type: MeetingMaterialType;

    static parse(dto): MeetingMaterial {
        const material = TypedMaterial.parse(dto, MeetingMaterial);
        material.type = dto.type;
        return material;
    }
}

export class AgendaItemMaterial extends TypedMaterial implements IAgendaItemMaterial {
    agendaItem: IAgendaItemIdRef;
    type: IssueMaterialType;

    static parse(dto): AgendaItemMaterial {
        const material = TypedMaterial.parse(dto, AgendaItemMaterial);
        material.type = dto.category || dto.type;
        return material;
    }
}


export class MaterialVersion implements IMaterialVersion {
    id: string;
    num: number;
    fileName: string;
    createdAt: Date;
    createdBy: IPersonRef;

    static parse(dto): MaterialVersion {
        if (!dto) {
            return null;
        }

        const version = new MaterialVersion();

        version.id = dto.id;
        version.num = (dto.num || dto.version);
        version.fileName = dto.fileName;
        version.createdBy = {
            id: dto.createdBy.id
        };
        version.createdAt = new Date(dto.createdAt);

        return version;
    }
}

export class MaterialVersionRef implements IMaterialVersionRef {
    id: string;
    num: number;

    static parse(dto): MaterialVersionRef {
        if (!dto) {
            return null;
        }

        const version = new MaterialVersionRef();

        version.id = dto.id;
        version.num = dto.version;

        return version;
    }
}

export class MeetingRef implements IMeetingRef {
    id: string;

    static parse(dto): MeetingRef {
        if (!dto) {
            return null;
        }

        const ref = new MeetingRef();

        ref.id = dto.meetingId; // TODO: объектная модель в DTO

        return ref;
    }
}

export class MeetingPresentia implements IMeetingPresentia {
    id: string;
    num: string;
    date: Date;
    address: string;
    place: string;
    collegialBody: ICollegialBody;
    type: MeetingType;
    agendaDueDate: Date;
    materialsDueDate: Date;
    state: MeetingStatus;
    hasProtocol: boolean;

    static parse(dto): MeetingPresentia {
        const meeting = new MeetingPresentia();

        meeting.id = dto.id;
        meeting.num = dto.num;
        meeting.collegialBody = CollegialBody.parse(dto.collegialBody);
        meeting.type = MeetingType.Presentia;
        meeting.date = new Date(dto.date);
        meeting.place = dto.place;
        meeting.address = dto.address;
        meeting.agendaDueDate = new Date(dto.agendaDueDate);
        meeting.materialsDueDate = new Date(dto.materialsDueDate);
        meeting.state = dto.status;

        return meeting;
    }
}

export class MeetingPresentiaMultilingual implements IMeetingPresentiaMultilingual {
    date: Date;
    place: { [key: string]: string; };
    address: { [key: string]: string; };
    num: string;
    collegialBody: ICollegialBody;
    type: MeetingType;
    agendaDueDate: Date;
    materialsDueDate: Date;
    state: MeetingStatus;
    id: string;
    hasProtocol: boolean;

    static parse(dto): MeetingPresentiaMultilingual {
        const meeting = new MeetingPresentiaMultilingual();

        meeting.id = dto.id;
        meeting.num = dto.num;
        meeting.collegialBody = CollegialBody.parse(dto.collegialBody);
        meeting.type = MeetingType.Presentia;
        meeting.date = new Date(dto.date);
        meeting.place = dto.place;
        meeting.address = dto.address;
        meeting.agendaDueDate = new Date(dto.agendaDueDate);
        meeting.materialsDueDate = new Date(dto.materialsDueDate);
        meeting.state = dto.status;
        meeting.hasProtocol = dto.hasProtocol;
        return meeting;
    }
}

export class MeetingAbsentia implements IMeetingAbsentia {
    startDate: Date;
    endDate: Date;
    num: string;
    collegialBody: ICollegialBody;
    type: MeetingType;
    agendaDueDate: Date;
    materialsDueDate: Date;
    state: MeetingStatus;
    id: string;
    hasProtocol: boolean;

    static parse(dto): MeetingAbsentia {
        const meeting = new MeetingAbsentia();

        meeting.id = dto.id;
        meeting.num = dto.num;
        meeting.collegialBody = CollegialBody.parse(dto.collegialBody);
        meeting.type = MeetingType.Absentia;
        meeting.startDate = new Date(dto.startDate);
        meeting.endDate = new Date(dto.endDate);
        meeting.agendaDueDate = new Date(dto.agendaDueDate);
        meeting.materialsDueDate = new Date(dto.materialsDueDate);
        meeting.state = dto.status;
        meeting.hasProtocol = dto.hasProtocol;
        return meeting;
    }
}

export class MeetingParticipant implements IMeetingParticipant {
    meeting: IMeetingRef;
    person: IPersonRef;
    roles: MeetingParticipantRole[];
    alternates: IPersonRef[];

    static parse(dto): MeetingParticipant {
        if (!dto) {
            return null;
        }

        const participant = new MeetingParticipant();

        participant.person = PersonRef.parse(dto);
        participant.alternates = (dto.alternates || []).map(x => PersonRef.parse(x));
        participant.roles = (dto.roles || []).map(x => MeetingParticipantRole[x.toString()]);

        return participant;
    }
}

export class Person implements IPerson {
    id: string;
    firstName: string;
    lastName: string;
    middleName: string;
    pictureUrl: string;

    static parse(dto): Person {
        if (!dto) {
            return null;
        }

        const person = new Person();

        person.id = dto.id;
        if (dto.info) {
            person.firstName = dto.info.firstName;
            person.lastName = dto.info.lastName;
            person.middleName = dto.info.middleName;
            person.pictureUrl = dto.info.profileUrl;
        } else {
            person.firstName = dto.firstName;
            person.lastName = dto.lastName;
            person.middleName = dto.middleName;
            person.pictureUrl = dto.pictureUrl;
        }
        return person;
    }
}

export class PersonRef implements IPersonRef {
    id: string;

    static parse(dto): PersonRef {
        if (!dto) {
            return null;
        }

        const ref = new PersonRef();

        ref.id = dto.id;

        return ref;
    }
}

export class Voting implements IVoting {
    id: string;
    meeting: IMeetingRef;
    subject: IMaterialVersionRef;
    votesFor: number;
    votesAbstain: number;
    votesAgainst: number;
    vetoApplied: boolean;
    closed: boolean;

    static parse(dto): Voting {
        if (!dto) {
            return null;
        }

        const voting = new Voting();

        voting.id = dto.id;
        voting.meeting = {
            id: dto.meeting.id
        };
        voting.subject = {
            id: dto.subject.id,
            num: dto.subject.num
        };
        voting.votesFor = dto.votesFor;
        voting.votesAbstain = dto.votesAbstain;
        voting.votesAgainst = dto.votesAgainst;
        voting.closed = dto.closed;
        voting.vetoApplied = dto.vetoApplied;

        return voting;
    }
}

export class Vote implements IVote {
    voting: IVotingRef;
    type: VoteType;
    owner: IPersonRef;
    specialOpinion: string;
    createdAt: Date;
    createdBy: IPersonRef;

    static parse(dto): Vote {
        const vote = new Vote();

        vote.type = dto.type;
        vote.owner = {
            id: dto.owner.id
        };
        vote.createdAt = new Date(dto.createdAt);
        vote.createdBy = {
            id: dto.createdBy.id
        };
        vote.specialOpinion = dto.comment;

        return vote;
    }
}

