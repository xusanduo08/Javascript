import React, { Component } from 'react';


class Title extends Component{

    componentDidUpdate(){
        console.log('Title didUpdate');
    }

    shouldComponentUpdate(nextProps){
        if(this.props.title !== nextProps.title){
            return true;
        }
        return false;
    }

    render(){
        return (
        	<div id='title' style={{color: this.props.title.color}}>{this.props.title.text}</div>
        )
    }
}

export default Title;