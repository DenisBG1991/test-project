import OrgUnit from '@app/presentation/admin-menu/admin-menu.model';

interface OrgChildUnit {
    idParent: string,
    orgChildUnits: Array<OrgUnit>
}

export default OrgChildUnit;
