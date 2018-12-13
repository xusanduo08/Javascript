import React from 'react';
import { observer } from 'mobx-react';
import Todo from './Todo';

class TodoList extends React.Component {
  render() {
    const { todoStore } = this.props;
    return (
      <div>
        {todoStore.todos.map((todo, index) => <Todo todo={todo} key={index} />)}
        Progress: {todoStore.completedTodosCount}
      </div>
    )
  }
}

export default TodoList;