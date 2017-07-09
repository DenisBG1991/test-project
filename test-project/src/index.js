import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import registerServiceWorker from './registerServiceWorker';

import configureStore from './store/configureStore';
import App from './containers/App';

import './index.css';

const store = configureStore();

ReactDOM.render(<Provider store={store}>
        <div className='app'>
            <App />
        </div>
    </Provider>,
    document.getElementById('root'));
registerServiceWorker();