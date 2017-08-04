export interface OrgUnit {
    id: string,
    name: string,
    type: string,
    hasChildren: boolean
}

export interface FullOrgsUnit extends OrgUnit {
    orgChildUnit: Array<OrgUnit>
}
