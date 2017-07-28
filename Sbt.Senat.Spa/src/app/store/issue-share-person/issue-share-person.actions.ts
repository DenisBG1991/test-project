import {Injectable} from '@angular/core';
import {IIssueRef} from '@app/store/issue';
import {IPerson, IPersonRef} from '@app/store/person/person.model';


@Injectable()
export class IssueSharePersonActions {


    static readonly LoadSharePersons = 'LOAD_SHARE_PERSONS';
    static readonly LoadSharePersonsComplete = 'LOAD_SHARE_PERSONS_COMPLETE';
    static readonly LoadSharePersonsFail = 'LOAD_SHARE_PERSONS_FAIL';

    static readonly AddSharePerson = 'ADD_SHARE_PERSON';
    static readonly RemoveSharePerson = 'REMOVE_SHARE_PERSON';

    loadSharePersons(ref: IIssueRef) {
        return {
            type: IssueSharePersonActions.LoadSharePersons,
            payload: {
                issue: ref
            }
        };
    }

    loadSharePersonsComplete(issue: IIssueRef, persons: IPersonRef[]) {
        return {
            type: IssueSharePersonActions.LoadSharePersonsComplete,
            payload: {
                issue: issue,
                persons: persons
            }
        };
    }

    loadSharePersonsFail(error) {
        return {
            type: IssueSharePersonActions.LoadSharePersonsFail,
            payload: {
                error: error
            }
        };
    }

    addSharePerson(issue: IIssueRef, person: IPersonRef) {
        return {
            type: IssueSharePersonActions.AddSharePerson,
            payload: {
                issue: issue,
                person: person
            }
        };
    }

    removeSharePerson(issue: IIssueRef, person: IPersonRef) {
        return {
            type: IssueSharePersonActions.RemoveSharePerson,
            payload: {
                issue: issue,
                person: person
            }
        };
    }
}
