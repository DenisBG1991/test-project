import { IAdUser, IAdUserDetailed } from '@app/store/admin/ad-user/ad-user.model';
import { ILayoutState } from '@app/store/admin/layout/layout.types';
import { IPermission } from '@app/store/admin/permission/permission.model';
import { IMultilingualPerson } from '@app/store/admin/person/person.model';
import { IRole } from '@app/store/admin/role/role.model';
import { IPersonUser } from '@app/store/admin/user/user.model';
import { IUserRole } from '@app/store/admin/user-role/user-role.model';
import { ICollegialBody } from '@app/store/collegial-body/collegial-body.model';
import { IUser } from '@app/store/user/user.model';
import { IHolding } from '@app/store/holding/holding.model';
import { ICompany } from '@app/store/company/company.model';

/**
 * Interface fot State-Admin.
 */
interface IAdminState {
    adUsers: Array<IAdUser>;
    adUsersDetailed: Array<IAdUserDetailed>;
    layout: ILayoutState;
    permissions: Array<IPermission>;
    persons: Array<IMultilingualPerson>;
    roles: Array<IRole>;
    users: Array<IPersonUser>;
    userRoles: Array<IUserRole>;
    collegialBodies: Array<ICollegialBody>;
    currentUser: IUser;
    holdings: Array<IHolding>;
    companies: Array<ICompany>;
}

export default IAdminState;
