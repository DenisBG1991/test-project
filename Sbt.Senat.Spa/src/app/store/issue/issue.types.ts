import {ICollegialBody} from '@app/store/collegial-body/collegial-body.model';
import {IPerson} from '@app/store/person/person.model';
import {ILabel} from '@app/store/label';
import {PermissionEnumDto} from '@app/shared/api';

export interface IIssue extends IIssueRef {
    title: { [key: string]: string };
    description: { [key: string]: string };
    status: string;
    estimate: string;
    collegialBody: ICollegialBody;
    labels: ILabel[];
    author: IPerson;
    createDate?: Date;
}

export interface IIssueRef {
    id: string;
}
