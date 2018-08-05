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
            num:0,
            count1: 0,
            count2: 0
        }
    }

    click(){
        this.setState({num:3})
        console.log(this.state.num)
    }

    incresmentByFunctionalSetstate(){
        this.setState((prevState)=>({count1:prevState.count1 + 1}))
        this.setState((prevState)=>({count1:prevState.count1 + 1}))
    }

    incresmentByDefaultSetstate(){
        this.setState({count2:this.state.count2+1})
        this.setState({count2:this.state.count2+1})
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
            <button onClick={this.click.bind(this)}>{this.state.num}</button><br />
            <button onClick={this.incresmentByFunctionalSetstate.bind(this)}>
                incresmentByFunctionalSetstate
                {this.state.count1}
            </button>
            <button onClick={this.incresmentByDefaultSetstate.bind(this)}>
                incresmentByDefaultSetstate
                {this.state.count2}
            </button>
        </div>)
    }
}

export default App