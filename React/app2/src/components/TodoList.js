import React from "react";
import Todo from "./Todos"

const TodoList = ({todos, onTodoClick}) => (
    <ul>
        {todos.map((todo, index) => {
            return (
                <Todo key={index} {...todo} onClick={() => onTodoClick(index)}/>
            )
        })}
    </ul>
)

export default TodoList