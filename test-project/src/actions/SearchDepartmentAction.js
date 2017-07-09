import axios from 'axios';

import {
    DEPARTMENT_REQUEST,
    DEPARTMENT_SUCCES,
} from '../constants/Department';

export function searchDepartment(department) {

    return function(dispatch) {

        dispatch({
            type: DEPARTMENT_REQUEST
        });

        axios.get('/db')
            .then(response => response.data)
            .then(data => {
                let idDepartment,
                    employees = [];
                data['departments'].forEach(dep => {
                    if (dep['name'] === department) idDepartment = dep['id'];
                });
                employees = data['employees'].filter(emp => {
                    return (emp['departmentId'] === idDepartment);
                });
                dispatch({
                    type: DEPARTMENT_SUCCES,
                    payload: employees
                });
            });
    };
}