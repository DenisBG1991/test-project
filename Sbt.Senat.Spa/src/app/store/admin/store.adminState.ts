import IAdminState from '@app/store/admin/store.model';

import { personLayoutInitialState } from '@app/store/admin/layout/person-layout-state.model';

/**
 * Initial State-Admin.
 */
const INITIAL_STATE: IAdminState = {
    adUsers: [],
    adUsersDetailed: [],
    layout: {
        person: personLayoutInitialState,
        createPersonForm: null,
        personForm: null
    },
    permissions: [],
    persons: [],
    roles: [],
    users: [],
    userRoles: [],
    collegialBodies: [],
    currentUser: null,
    holdings: [],
    companies: []
};

export default INITIAL_STATE;
