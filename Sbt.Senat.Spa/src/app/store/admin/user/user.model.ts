import {IPersonRef} from '@app/store/person/person.model';


export interface IPersonUser {
    id: string;
    person: IPersonRef;
    authMethods: { [key: string]: string };
}

