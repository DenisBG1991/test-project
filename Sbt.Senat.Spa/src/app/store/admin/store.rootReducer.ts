import IAdminState from '@app/store/admin/store.model';
import { ILayoutState } from '@app/store/admin/layout/layout.types';

import { combineReducers } from 'redux';

import { adUsersReducer, adUsersDetailedReducer } from '@app/store/admin/ad-user/ad-user.reducer';
import { createPersonFormReducer } from '@app/store/admin/layout/create-person-form.reducer';
import { personFormReducer } from '@app/store/admin/layout/person-form.reducer';
import { personLayoutReducer } from '@app/store/admin/layout/person-layout.reducer';
import { permissionReducer } from '@app/store/admin/permission/permission.reducer';
import { personReducer } from '@app/store/admin/person/person.reducer';
import { roleReducer } from '@app/store/admin/role/role.reducer';
import { routerReducer } from '@app/store/admin/router/router.reducer';
import { userReducer } from '@app/store/admin/user/user.reducer';
import { userRoleReducer } from '@app/store/admin/user-role/user-role.reducer';
import { collegialBodyReducer } from '@app/store/collegial-body/collegial-body.reducer';
import { sessionReducer } from '@app/store/session/session.reducer';
import { holdingReducer } from '@app/store/holding/holding.reducer';
import { companyReducer } from '@app/store/company/company.reducer';

/**
 * RootReducer for State-Admin.
 * @type {Reducer<IAdminState>}
 */
const rootReducer = combineReducers<IAdminState>({
    adUsers: adUsersReducer,
    adUsersDetailed: adUsersDetailedReducer,
    layout: combineReducers<ILayoutState>({
        createPersonForm: createPersonFormReducer,
        personForm: personFormReducer,
        person: personLayoutReducer
    }),
    permissions: permissionReducer,
    persons: personReducer,
    roles: roleReducer,
    router: routerReducer,
    users: userReducer,
    userRoles: userRoleReducer,
    collegialBodies: collegialBodyReducer,
    currentUser: sessionReducer,
    holdings: holdingReducer,
    companies: companyReducer
});

export default rootReducer;
