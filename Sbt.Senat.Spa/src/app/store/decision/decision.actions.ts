import {IDecision, IDecisionApproval, IDecisionRef} from '@app/store/decision/decision.model';
import {Injectable} from '@angular/core';
import {IPersonRef} from '@app/store/person/person.model';
import {IMaterialVersionRef} from '@app/store/material-version/material-version.model';
import {IMeetingRef} from '@app/store/meeting/meeting-ref.model';
import {MeetingRef} from '@app/services/api/mapping.types';

@Injectable()
export class DecisionActions {
    static readonly CreateDecision = 'CREATE_DECISION';
    static readonly LoadDecisions = 'LOAD_DECISIONS';
    static readonly ApproveDecision = 'APPROVE_DECISION';

    static readonly ApproveDecisionComplete = 'APPROVE_DECISION_COMPLETE';
    static readonly LoadDecisionsComplete = 'LOAD_DECISIONS_COMPLETE';

    static readonly SendDecisionToApproval = 'SEND_DECISION_TO_APPROVAL';

    loadDecisions(meeting: MeetingRef) {
        return {
            type: DecisionActions.LoadDecisions,
            payload: {
                meeting: meeting
            }
        };
    }

    loadDecisionsComplete(decisions: Array<IDecision>) {
        return {
            type: DecisionActions.LoadDecisionsComplete,
            payload: {
                decisions: decisions
            }
        };
    }

    approveDecisionComplete (decision: IDecisionRef, approval: IDecisionApproval) {
        return {
            type: DecisionActions.ApproveDecisionComplete,
            payload: {
                decision: decision,
                approval: approval
            }
        };
    }

    createDecision(decision: {
                       materialVersion: IMaterialVersionRef;
                       meeting: IMeetingRef;
                       accepted: boolean;
                   }) {
        return {
            type: DecisionActions.CreateDecision,
            payload: {
                decision: decision
            }
        };
    }

    sendDecisionToApproval(decision: IDecisionRef, person: IPersonRef) {
        return {
            type: DecisionActions.SendDecisionToApproval,
            payload: {
                decision: decision,
                person: person
            }
        };
    }

    approveDecision(decision: IDecisionRef) {
        return {
            type: DecisionActions.ApproveDecision,
            payload: {
                decision: decision
            }
        };
    }

}
