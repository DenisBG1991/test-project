import {IIssueRef} from '@app/store/issue';
import {IPersonRef} from '@app/store/person/person.model';

export interface IIssuePerson extends IPersonRef {
    issue: IIssueRef;
}
