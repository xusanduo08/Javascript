import React from "react";
import ReactDOM from "react-dom";
//import registerServiceWorker from './registerServiceWorker';
import {createStore} from "redux";
import input from "./reducer.js";
import Provider from "./Provider.js";
import connect from "./connect.js";

const store = createStore(input);

class App extends React.Component {

    render(){
        return (
            <div>
                context is :
                {this.context.store}
            </div>
        )
    }
}

const ConApp = connect(
    state => ({input:state.input}),
    dispatch => ({in:dispatch})
)(App);

ReactDOM.render(
    <Provider store={store}>
        <ConApp/>
    </Provider>,
    document.getElementById("root")
)

//registerServiceWorker();