import {IPerson, IPersonRef} from '@app/store/person/person.model';
import {AgendaItemStatus} from '@app/store/agenda-item/agenda-item-status.model';
import {IAgendaItem, IAgendaItemRef} from '@app/store/agenda-item/agenda-item.model';
import {IAgendaItemParticipant, IParticipant} from '@app/store/agenda-item-participants/agenda-item-participant.model';
import {AgendaItemParticipantRole} from '@app/store/agenda-item-participants/agenda-item-participant-role.model';
import {IIssueRef} from '@app/store/issue';
import {IMeetingParticipant} from '@app/store/meeting-participant/meeting-participant.model';
import {MeetingParticipantRole} from '@app/store/meeting-participant/meeting-participant-role.model';
import {IAgenda} from '@app/store/agenda/agenda.model';
import {IMeetingRef} from '@app/store/meeting/meeting-ref.model';
import {
    IMeetingPresentia, MeetingType, IMeetingAbsentia,
    IMeetingPresentiaMultilingual
} from '@app/store/meeting/meeting.model';
import {ICollegialBody} from '@app/store/collegial-body/collegial-body.model';
import {IIssueMaterialFolder} from '@app/store/issue-material-folder/issue-material-folder.model';
import {IMaterialVersion, IMaterialVersionRef} from '@app/store/material-version/material-version.model';
import {IIssueMaterial} from '@app/store/issue-material/issue-material.model';
import {MaterialType} from '@app/store/material/material-type.model';
import {IVoting, IVotingRef} from '@app/store/voting/voting.model';
import {IVote} from '@app/store/vote/vote.model';
import {VoteType} from '@app/store/vote/vote-type.model';
import {MeetingStatus} from '@app/store/meeting/meeting-status';
import {ICompanyRef} from '@app/store/company/company.model';
import {IHoldingRef} from '@app/store/holding/holding.model';
import {IDecision, IDecisionApproval} from '@app/store/decision/decision.model';

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
    meeting: IMeetingRef;
    issue: IIssueRef;
    title: string;
    description: string;
    order: number;
    status: AgendaItemStatus;

    static parse(dto): AgendaItem {
        if (!dto) {
            return null;
        }

        const item = new AgendaItem();

        item.issue = {
            id: dto.issue.id
        };
        item.order = dto.order;
        item.status = dto.state; // TODO: parse enum
        item.title = dto.issue.title;
        item.description = dto.issue.description;

        return item;
    }
}

export class AgendaItemParticipant implements IAgendaItemParticipant {
    agendaItem: IAgendaItemRef;
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
        decisionApproval.approvingPerson = Person.parsePublic(dto.approvingPerson);
        decisionApproval.approved = dto.approved;
        decisionApproval.approvedAt = dto.approvedAt;

        return decisionApproval;
    }
}

export class Decision implements IDecision {
    id: string;
    materialVersion: IMaterialVersionRef;
    meeting: IMeetingRef;
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
        decision.materialVersion = MaterialVersionRef.parse(dto.decisionProjectVersion);
        decision.accepted = dto.type === 'Accepted';

        decision.approval = DecisionApproval.parse(dto.approval);

        return decision;
    }
}

export class IssueMaterialFolder implements IIssueMaterialFolder {
    issue: IIssueRef;
    name: string;
    location: string;

    static parse(dto): IssueMaterialFolder {
        if (!dto) {
            return null;
        }

        const folder = new IssueMaterialFolder();
        folder.name = dto.name;
        folder.location = dto.location + '\\';

        return folder;
    }
}

export class IssueMaterial implements IIssueMaterial {
    issue: IIssueRef;
    id: string;
    location: string;
    type: MaterialType;
    currentVersion: IMaterialVersionRef;

    static parse(dto): IssueMaterial {
        if (!dto) {
            return null;
        }

        const material = new IssueMaterial();

        material.id = dto.id;
        material.location = dto.location + '\\';
        material.type = dto.type;
        material.currentVersion = {
            id: dto.id,
            num: dto.currentVersion.num
        };

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
        version.num = dto.num;
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

    static parsePublic(dto): Person {
        if (!dto) {
            return null;
        }

        const person = new Person();

        person.id = dto.id;
        person.firstName = dto.firstName;
        person.lastName = dto.lastName;
        person.middleName = dto.middleName;
        person.pictureUrl = dto.pictureUrl;

        return person;
    }

    static parse(dto): Person {
        if (!dto) {
            return null;
        }

        const person = new Person();

        person.id = dto.id;
        person.firstName = dto.info.firstName;
        person.lastName = dto.info.lastName;
        person.middleName = dto.info.middleName;
        person.pictureUrl = dto.info.profileUrl;

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

