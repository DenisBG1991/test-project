import {IMaterialVersionRef} from '@app/store/material-version/material-version.model';
import {IMeetingRef} from '@app/store/meeting/meeting-ref.model';
import {IPerson} from '@app/store/person/person.model';
import {IIssueRef} from '@app/store/issue';

export interface IDecisionRef {
    id: string
}
export interface IDecisionApproval {
    approvingPerson: IPerson,
    approved: boolean,
    approvedAt: Date
}

export interface IDecision extends IDecisionRef {
    materialVersion: IMaterialVersionRef;
    meeting: IMeetingRef;
    issue: IIssueRef;
    accepted: boolean;
    approval: IDecisionApproval
}
