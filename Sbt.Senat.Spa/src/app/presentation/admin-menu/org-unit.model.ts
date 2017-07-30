export interface OrgUnit {
    id: string,
    name: string,
    type: string,
    hasChildren: boolean
}

export interface OrgChildUnit {
    idParent: string,
    orgsChildUnit: Array<OrgUnit>
}
