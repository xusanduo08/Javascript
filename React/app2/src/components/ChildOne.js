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
        setTimeout(() => {
            this.props.name = 2000
        }, 2000)
        return this.props.children
    }
}

ChildOne.contextTypes = {
    changeValue: PropTypes.func,
    value: PropTypes.string
}

export default ChildOne;