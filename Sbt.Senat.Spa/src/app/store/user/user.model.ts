import {IPerson} from '@app/store/person/person.model';

export interface IUser extends IPerson, IUserRef {
    username: string;
}

export interface IUserRef {
    userId: string;
}
