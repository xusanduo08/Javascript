import React, { Component } from 'react';

class Content extends Component{

    componentDidUpdate(){
        console.log('content didUpdate')
    }

    shouldComponentUpdate(nextProps){
        if(this.props.content !== nextProps.content){
            return true;
        }
        return false;
    }

    render(){
        return (
        	<div id='content'>{this.props.content.text}</div>
        )
    }
}

export default Content;