import axios from 'axios';

import {
    EMPLOYEE_REQUEST,
    EMPLOYEE_SUCCES
} from '../constants/Employee';

export function searchEmployee(employee) {

    return function(dispatch) {

        dispatch({
            type: EMPLOYEE_REQUEST
        });

        axios.get('/db')
            .then(response => response.data)
            .then(data => {
                let fullname = employee.split(' ');
                let firstname = '',
                    lastname = '',
                    employees = [];
                if (fullname.length === 2) {
                    firstname = fullname[0];
                    lastname = fullname[1];
                    data['employees'].forEach(emp => {
                        if ((emp['firstName'] === firstname || emp['lastName'] === firstname)
                            && (emp['firstName'] === lastname || emp['lastName'] === lastname)) employees.push(emp);
                    });
                } else if (fullname.length === 1) {
                    firstname = fullname[0];
                    data['employees'].forEach(emp => {
                        if (emp['firstName'] === firstname || emp['lastName'] === firstname) employees.push(emp);
                    });
                }
                dispatch({
                    type: EMPLOYEE_SUCCES,
                    payload: employees
                });
                console.log(employees);
            });
    };
}