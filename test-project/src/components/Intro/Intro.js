import React from 'react';
import {Button, Table} from "react-bootstrap";

import './Intro.css';

function Intro({ employees, fetching, deleteEmployee}) {
    const handleDeleteEmployee = event => {
        event.preventDefault();
        deleteEmployee(event.target.dataset.button, employees);
    };

    let employeesTemplate;
    if (employees.length > 0) {
        employeesTemplate = employees.map((item, index) => {
            return (
                <tr key={index}>
                    <td>{item['id']}</td>
                    <td>{item['firstName']}</td>
                    <td>{item['lastName']}</td>
                    <td>{item['departmentId']} <Button data-button={item['id']} onClick={handleDeleteEmployee} bsClass="btn btn-danger btn-delete">
                        Delete
                    </Button>
                    </td>
                </tr>
            );
        });
    } else {
        employeesTemplate = [];
    }
    return (
        <div className="Intro">
            { fetching ? <p>Загрузка...</p> :
                <Table striped bordered condensed hover>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Department ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employeesTemplate}
                    </tbody>
                </Table>
            }
        </div>
    );
}

export default Intro;