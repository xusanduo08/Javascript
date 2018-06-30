import React from 'react'
import Footer from './Footer'
import AddTodo from '../containers/AddTodo'
import VisibleTodoList from '../containers/VisibleTodoList';
import Button from "./button";
import Container from "./Container"

class App extends React.Component {
    constructor(){
        super()
    }

    componentWillReceiveProps(nextProps){
        console.log('componentWillReceiveProps', nextProps)
    }

    render(){
        return  (<div>
            <AddTodo />
            <VisibleTodoList />
            <Footer />
            <Button />
            <Container />
        </div>)
    }
}

export default App