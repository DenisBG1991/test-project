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

        axios['get']('/db/departments')
            .then(response => response.data)
            .then(data => {
                let idDepartment;
                data.forEach(dep => {
                    if (dep['name'] === department) idDepartment = dep['id'];
                });
                axios['get']('/db/employees')
                    .then(response => response.data)
                    .then(data => {
                        let employees = [];
                        employees = data.filter(emp => {
                            return (emp['departmentId'] === idDepartment);
                        });
                        dispatch({
                            type: DEPARTMENT_SUCCES,
                            payload: employees
                        });
                    });
            });
    };
}