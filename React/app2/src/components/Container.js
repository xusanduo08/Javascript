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
        return (
            <div>
                <ChildOne data={this.state.value}>
                    <Children1 />
                </ChildOne>
                <ChildTwo />
            </div>
        )
        
    }

}
Container.childContextTypes = {
    value: PropTypes.string,
    changeValue: PropTypes.func
}

export default Container