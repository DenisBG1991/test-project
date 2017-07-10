import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import registerServiceWorker from './registerServiceWorker';

import axios from 'axios';

import configureStore from './store/configureStore';
import App from './containers/App';

import './index.css';

let initialState = {
    employees: [],
    fetching: false
};

axios['get']('/db/employees')
    .then(response => response.data)
    .then(data => {
        initialState['employees'] = data;

        const store = configureStore(initialState);

        ReactDOM['render'](<Provider store={store}>
                <div className='app'>
                    <App />
                </div>
            </Provider>,
            document.getElementById('root'));
        registerServiceWorker();
    });

