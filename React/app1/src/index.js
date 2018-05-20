import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import registerServiceWorker from './registerServiceWorker';
import {Provider} from "react-redux";
import {createStore} from "redux";
import todoApp from "./reducers";
import App from "./components/App"

let store = createStore(todoApp);


ReactDOM.render(
    <Provider store = {store}>
        <App />
    </Provider>, 
    document.getElementById('root')
);
registerServiceWorker();
