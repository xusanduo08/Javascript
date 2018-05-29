import React from "react";
import {connect} from "react-redux";
import {addTodo} from "../actions/actions"


const Button = ({dispatch}) => {
    return (
        <button onClick={(e) =>{
            dispatch({type:"FETCH_REQUEST"})

        }}>
        点击</button>
    )
}

export default connect()(Button);