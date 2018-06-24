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
import ChildTwosub from './components/ChildTwosub'

const sagaMiddleware = createSagaMiddleware(sagas);
const middlewares = [sagaMiddleware]
const store = createStore(todoApp, applyMiddleware(...middlewares, logger));
console.log(store);

const changeStore = (store) => {
    store.test = 122;
}
setTimeout(() => {
    changeStore(store)
    console.log(store)
}, 1000)

ReactDOM.render(
    <Provider store={store}>
        <div>
        <App />
        <ChildTwosub />
        </div>
        
    </Provider>
    , document.getElementById('root'));
registerServiceWorker();
