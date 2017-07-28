import {IPersonRef} from '@app/store/person/person.model';
export interface IMultilingualPerson extends IPersonRef {
    firstName: { [key: string]: string };
    lastName: { [key: string]: string };
    middleName: { [key: string]: string };
    pictureUrl: string;
}

