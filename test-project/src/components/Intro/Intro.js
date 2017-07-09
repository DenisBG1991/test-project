import React from 'react';
import { Table } from "react-bootstrap";

import './Intro.css';

function Intro({ employees, fetching}) {
    console.log(employees);
    console.log(fetching);
    return (
        <div className="Intro">
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
                <tr>
                    <td>1</td>
                    <td>Mark</td>
                    <td>Otto</td>
                    <td>@mdo</td>
                </tr>
                </tbody>
            </Table>
        </div>

    );
}

export default Intro;