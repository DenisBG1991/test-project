import {IIssueRef} from '@app/store/issue';
import {IMeetingRef} from '@app/store/meeting/meeting-ref.model';
export interface IPermissionFilter {
    issue: IIssueRef,
    meeting: IMeetingRef
}
