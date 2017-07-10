import axios from 'axios';

import {
    EMPLOYEE_DELETE
} from '../constants/Employee';

export function deleteEmployee(id, data) {

    return function(dispatch) {
        axios['delete'](`/db/employees/${id}`)
            .then(response => response.data)
            .then(() => {
                let employees = data.filter(item => item['id'] !== Number(id));
                dispatch({
                    type: EMPLOYEE_DELETE,
                    payload: employees
                });
            });
    };
}