import {ICollegialBody} from '@app/store/collegial-body/collegial-body.model';

export interface IMeetingsFilter {
    collegialBody?: ICollegialBody;
    num?: string;
    from?: Date;
    to?: Date;
}
