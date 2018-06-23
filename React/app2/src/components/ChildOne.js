import React from "react";
import PropTypes from "prop-types";

class ChildOne extends React.Component {
    constructor(props){
        super()
    }

    

    handleChange= e => {
        this.context.changeValue(e.target.value);
        
    }

    render(){
        return (
            <div>
                component1
                <input onChange={this.handleChange} />
            </div>
        )
    }
}

ChildOne.contextTypes = {
    changeValue: PropTypes.func,
    value: PropTypes.string
}

export default ChildOne;