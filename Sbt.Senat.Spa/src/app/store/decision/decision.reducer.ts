import {IDecision} from '@app/store/decision/decision.model';
import {DecisionActions} from '@app/store/decision/decision.actions';

export function decisionReducer(state: Array<IDecision> = [], action) {
    switch (action.type) {

        case DecisionActions.LoadDecisionsComplete:
            return state.filter(x => !action.payload.decisions.some(d =>
            d.materialVersion.id === x.materialVersion.id
            && d.materialVersion.num === x.materialVersion.num
            && d.meeting.id === x.meeting.id))
                .concat(action.payload.decisions);
        case DecisionActions.ApproveDecisionComplete:
            const decison = state.find(f => f.id === action.payload.decision.id);
            if (decison) {
                const ret = state;
                const inx = ret.indexOf(decison);
                decison.approval = action.payload.approval;
                ret[inx] = decison;
                return ret;
            } else {
                return state;
            }
        default:
            return state;
    }
}
