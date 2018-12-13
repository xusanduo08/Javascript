import React from "react";

const Todo = (props) => {
    
    return (
        <li onClick={props.onClick}
            style={{textDecoration: props.completed? "line-through" : "none"}}
        >
            {props.text}
        </li>
    )
}

export default Todo