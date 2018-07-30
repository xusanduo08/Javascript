import React from "react";
import ReactDOM from "react-dom";
//import registerServiceWorker from './registerServiceWorker';
import {createStore} from "redux";
import input from "./reducer.js";
import Provider from "./Provider.js";

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

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById("root")
)

//registerServiceWorker();