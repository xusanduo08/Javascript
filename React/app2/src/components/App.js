import React from 'react'
import Footer from './Footer'
import AddTodo from '../containers/AddTodo'
import VisibleTodoList from '../containers/VisibleTodoList';
import Button from "./button";
import Container from "./Container"
import Select from "./Select.js";

class App extends React.Component {
    constructor(){
        super()
        this.state={
            num:0
        }
    }

    click(){
        this.setState({num:3})
        console.log(this.state.num)
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
            <Select values={["State.", "Should.", "Be.", "Synchronous."]} onSelect={value => console.log(value)} />
            <button onClick={this.click.bind(this)}>{this.state.num}</button>
        </div>)
    }
}

export default App