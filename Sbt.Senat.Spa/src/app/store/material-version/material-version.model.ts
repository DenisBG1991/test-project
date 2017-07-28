import {IPersonRef} from '@app/store/person/person.model';

export interface IMaterialVersion extends IMaterialVersionRef {
    id: string;
    num: number;
    fileName: string;
    createdAt: Date;
    createdBy: IPersonRef;
}

export interface IMaterialVersionRef {
    id: string;
    num: number;
}
