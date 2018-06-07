import React from "react";
import PropTypes from "react";


class ChildTwo extends React.Component {
    constructor(){
        super()
    }

    render(){
        return (
            <div>
                <p>{this.context.value}</p>
                <input value={this.context.value} />
            </div>
        )
        
    }
}

ChildTwo.contextTypes = {
    value: PropTypes.string
}

export default ChildTwo