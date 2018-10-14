import React from 'react';
import { observer } from 'mobx-react';

@observer
class Todo extends React.Component {
  onToggleCompleted = () =>{
    const todo = this.props.todo;
    todo.completed = !todo.completed;
  }

  onRename = () => {
    const todo = this.props.todo;
    todo.task = prompt('Task name', todo.task) || '';
  }
  
  render() {
    const { todo }  = this.props;
    return (
      <li onDoubleClick={this.onRename}>
        <input 
          type='checkbox'
          checked={todo.completed}
          onChange={this.onToggleCompleted}
        />
        {todo.task}
      </li>
    )
  }
}

export default Todo;