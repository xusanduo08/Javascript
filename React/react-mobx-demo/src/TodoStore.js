import React from 'react';
import { observable, computed } from 'mobx';
import { observer } from 'mobx-react';


class TodoStore {
  @observable todos = [];
  @observable pendingRequests = 0;
  @computed get completedTodosCount() {
    return this.todos.filter(todo => todo.completed === true).length;
  }

  addTodo(task) {
    this.todos.push({
      task,
      completed: false
    })
  }
}

export default TodoStore;