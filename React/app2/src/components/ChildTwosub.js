import React from "react";
import PropTypes from "react";


class ChildTwosub extends React.Component {
    constructor(props, context){
        super()
        
    }

    shouldComponentUpdate(props, state, context){
        
        return true;
    }

    render(){
        return (
            <div>
                ChildTwo2
                <p>{this.context.value}</p>
                <input value={this.context.value} />
            </div>
        )
        
    }
}

ChildTwosub.contextTypes = {
    value: PropTypes.string,
    store:PropTypes.isRequired
}

export default ChildTwosub