import React from "react";
import PropTypes from "react";


class ChildTwosub extends React.Component {
    constructor(){
        super()
    }

    shouldComponentUpdate(props, state, context){
        console.log(context);
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
    value: PropTypes.string
}

export default ChildTwosub