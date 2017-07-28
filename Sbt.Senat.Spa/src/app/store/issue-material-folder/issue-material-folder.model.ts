import {IIssueRef} from '@app/store/issue';
import {IMaterialFolder} from '@app/store/material/material-folder.model';

export interface IIssueMaterialFolder extends IMaterialFolder {
    issue: IIssueRef;
}
