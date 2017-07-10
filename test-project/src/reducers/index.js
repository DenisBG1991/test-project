import {
    DEPARTMENT_REQUEST,
    DEPARTMENT_SUCCES
} from '../constants/Department';

import {
    EMPLOYEE_REQUEST,
    EMPLOYEE_SUCCES,
    EMPLOYEE_DELETE
} from '../constants/Employee';

const initialState = {
    employees: [],
    fetching: false
};

export default function employee(state = initialState, action) {
    switch (action.type) {
        case DEPARTMENT_REQUEST:
            return { ...state, fetching: true };

        case DEPARTMENT_SUCCES:
            return { ...state, employees: action.payload, fetching: false };

        case EMPLOYEE_REQUEST:
            return { ...state, fetching: true };

        case EMPLOYEE_SUCCES:
            return { ...state, employees: action.payload, fetching: false };

        case EMPLOYEE_DELETE:
            return { ...state, employees: action.payload, fetching: false };

        default:
            return state;
    }
}
