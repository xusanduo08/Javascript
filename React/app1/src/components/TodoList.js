import React from "react";
import Todo from "./Todo";

const TodoList = ({todos, onTodoClick}) => (
    <ul>
        {todos.map((todo, index) => (
            <Todo key={index} {...todo} onClick={() => onTodoClick(index)} />
        ))}
    </ul>
)

export default TodoList;