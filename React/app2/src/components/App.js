import React from 'react'
import Footer from './Footer'
import AddTodo from '../containers/AddTodo'
import VisibleTodoList from '../containers/VisibleTodoList';
import Button from "./button";

const App = () => (
  <div>
    <AddTodo />
    <VisibleTodoList />
    <Footer />
    <Button />
  </div>
)

export default App