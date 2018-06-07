import React from 'react'
import Footer from './Footer'
import AddTodo from '../containers/AddTodo'
import VisibleTodoList from '../containers/VisibleTodoList';
import Button from "./button";
import Container from "./Container"

const App = () => (
  <div>
    <AddTodo />
    <VisibleTodoList />
    <Footer />
    <Button />
    <Container />
  </div>
)

export default App