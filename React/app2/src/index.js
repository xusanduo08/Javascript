import React from 'react';
import ReactDOM from 'react-dom';

import logger from "redux-logger";

import registerServiceWorker from './registerServiceWorker';
import {createStore, applyMiddleware} from "redux";
import todoApp from "./reducers"
import {Provider} from "react-redux";
import App from "./components/App";
import createSagaMiddleware from "redux-saga";
import sagas from "./sagas"

const sagaMiddleware = createSagaMiddleware(sagas);
const middlewares = [sagaMiddleware]
const store = createStore(todoApp, applyMiddleware(...middlewares, logger));

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>
    , document.getElementById('root'));
registerServiceWorker();
