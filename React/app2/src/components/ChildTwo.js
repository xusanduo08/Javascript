import React from "react";
import PropTypes from "react";
import ChildTwosub from './ChildTwosub.js';


class ChildTwo extends React.Component {
    constructor(){
        super()
    }

    getChildContext(){
        return {
            value: this.context.value
        }
    }

    shouldComponentUpdate(props, state, context){
        console.log(context)
        if(context.value == 1){
            return false
        }
        return true
    }

    render(){
        return (
            <div>
                <p>{this.context.value}</p>
                <input value={this.context.value} />
                <ChildTwosub />
            </div>
        )
        
    }
}

ChildTwo.contextTypes = {
    value: PropTypes.string
}

ChildTwo.childContextTypes = {
    value: PropTypes.string
}

export default ChildTwo