import { IPersonUser } from '@app/store/admin/user/user.model';

export interface IAdUser {
    adLogin: string,
    firstName: string,
    lastName: string,
    middleName: string,
    pictureUrl: string,
    hasPhoto: boolean
}

export interface IAdUserDetailed extends IAdUser {
    email: string,
    userPerson: IPersonUser
}
