import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { searchDepartment } from '../actions/SearchDepartmentAction';
import { searchEmployee } from '../actions/SearchEmployeeAction';


import Header from '../components/Header/Header';
import Menu from '../components/Menu/Menu';
import Intro from '../components/Intro/Intro';

import './App.css';

class App extends Component {
    render() {
        const data = this.props.data;
        return (
            <div className="App">
                <Header />
                <Menu searchDepartment={this.props.searchDepartment} searchEmployee={this.props.searchEmployee} />
                <Intro employees={data.employees} fetching={data.fetching}/>
            </div>
        );
    };
}

function mapStateToProps (state) {
    return {
        data: state
    };
}

function mapDispatchToProps(dispatch) {
    return {
        searchDepartment: bindActionCreators(searchDepartment, dispatch),
        searchEmployee: bindActionCreators(searchEmployee, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);