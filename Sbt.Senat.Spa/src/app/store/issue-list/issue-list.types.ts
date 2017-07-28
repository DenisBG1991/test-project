import {ICollegialBody} from '@app/store/collegial-body/collegial-body.model';
import {IPerson} from '@app/store/person/person.model';
import {ILabel} from '@app/store/label';

export interface IIssueListFilter {
    collegialBody?: ICollegialBody;
    title?: string;
    labels?: ILabel[];
    from?: Date;
    to?: Date;
    speaker?: string;
}

export interface IIssueListItem {
    id: string;
    title: string;
    description: string;
    status: string;
    estimate: string;
    collegialBody: ICollegialBody;
    labels: ILabel[];
    author: IPerson;
    createDate: Date;
}
