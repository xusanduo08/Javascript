import React from "react";
import PropTypes from "prop-types";
import ChildOne from "./ChildOne";
import ChildTwo from "./ChildTwo";
import Children1 from './Children1';

class Container extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            value: ""
        }
    }
    changeValue = value =>{
        this.setState({value})
    }
    getChildContext(){
        return {
            value: this.state.value,
            changeValue: this.changeValue
        }
    }

    render(){
        return React.createElement(
            'div',
            {}, 
            [
                React.createElement(ChildOne, 
                    {date:this.state.value}, 
                    React.createElement(Children1))
            ]
            )
        
    }

}
Container.childContextTypes = {
    value: PropTypes.string,
    changeValue: PropTypes.func
}

export default Container