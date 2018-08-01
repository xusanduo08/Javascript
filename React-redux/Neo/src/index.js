import React from "react";
import ReactDOM from "react-dom";
import {createStore} from "redux";
import todo from "./reducer.js";
import Provider from "./Provider.js";
import App from './App.js';

const store = createStore(todo);



ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById("root")
)