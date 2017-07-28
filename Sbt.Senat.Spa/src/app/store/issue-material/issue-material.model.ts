import {IMaterial} from '@app/store/material';
import {IIssueRef} from '@app/store/issue';

/**
 * Материал вопроса.
 */
export interface IIssueMaterial extends IMaterial {
    issue: IIssueRef;
}
