import {IIssuePerson} from '@app/store/issue-share-person/issue-share-person.model';
import {IssueSharePersonActions} from '@app/store/issue-share-person/issue-share-person.actions';
export function issueSharePersonReducer(state: Array<IIssuePerson> = [], action) {
    switch (action.type) {
        case IssueSharePersonActions.LoadSharePersonsComplete:
            return state.filter(f => f.issue.id !== action.payload.issue.id)
                .concat(action.payload.persons.map(p => {
                    return {
                        id: p.id,
                        issue: action.payload.issue
                    }
                }));
        case IssueSharePersonActions.AddSharePerson:
            return state.filter(f => !(f.issue.id === action.payload.issue.id
            && f.id === action.payload.person.id))
                .concat([{
                    id: action.payload.person.id,
                    issue: action.payload.issue
                }]);
        case IssueSharePersonActions.RemoveSharePerson:
            return state.filter(f => !(f.issue.id === action.payload.issue.id
            && f.id === action.payload.person.id));
        default:
            return state;
    }
}
