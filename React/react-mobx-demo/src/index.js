import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import * as serviceWorker from './serviceWorker';
import TodoStore from './TodoStore.js';
import TodoList from './TodoList.js'

const todoStore = new TodoStore();
todoStore.addTodo('foo');
todoStore.addTodo('far')
ReactDOM.render(
    <TodoList todoStore={todoStore} />,
    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
