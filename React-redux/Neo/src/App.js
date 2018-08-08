import React from "react";
import connect from "./connect.js";

class App extends React.Component {

    render(){
        return (
            <div onClick={this.props.add}>
                context is :
                {this.props.todos.length}
            </div>
        )
    }
}

export default  connect(
    state => ({todos:state.todos}),
    dispatch => {
        return {
            add: () => {
                dispatch({type: 'ADD_TODO', text:"123"})
            }
        }
    },
    undefined,
    {withRef:true}
)(App);