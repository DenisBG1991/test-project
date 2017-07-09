import React from 'react';
import {Button, Col, ControlLabel, Form, FormControl, FormGroup, Glyphicon} from "react-bootstrap";

import './Menu.css';

function Menu({searchDepartment, searchEmployee}) {
    let inputDepartment,
        inputEmployee;

    const handleDepartmentSearch = event => {
        event.preventDefault();
        searchDepartment(inputDepartment.value);
        inputDepartment.value = '';
    };

    const handleEmployeeSearch = event => {
        event.preventDefault();
        searchEmployee(inputEmployee.value);
        inputEmployee.value = '';
    };

    return (
        <div className="Menu">
            <Form horizontal>
                <FormGroup controlId="formDepartments">
                    <Col componentClass={ControlLabel} lg={3}>
                        Departments:
                    </Col>
                    <Col lg={6}>
                        <FormControl type="text" placeholder="Departments" inputRef={ref => inputDepartment = ref} />
                    </Col>
                    <Col lg={3}>
                        <Button onClick={handleDepartmentSearch}>
                            <Glyphicon glyph="search" /> Search
                        </Button>
                    </Col>
                </FormGroup>

                <FormGroup controlId="formEmployees">
                    <Col componentClass={ControlLabel} lg={3}>
                        Employees:
                    </Col>
                    <Col lg={6}>
                        <FormControl type="text" placeholder="Employees" inputRef={ref => inputEmployee = ref} />
                    </Col>
                    <Col lg={3}>
                        <Button onClick={handleEmployeeSearch}>
                            <Glyphicon glyph="search" /> Search
                        </Button>
                    </Col>
                </FormGroup>
            </Form>
        </div>
    );
}

export default Menu;