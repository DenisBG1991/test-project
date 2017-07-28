export interface IPerson extends IPersonRef {
    firstName: string;
    lastName: string;
    middleName: string;
    pictureUrl: string;
}

export interface IPersonRef {
    id: string;
}
