import React from 'react';

function connect(storeContext,component) {
  

  class Connect extends React.Component {
    constructor(props, context){
      super(props, context);
      //this.props.store.subscribe(()=> this.setState({}));
    }

    render() {
      
      return (
        <storeContext.Consumer>
          {({state}) => {
            console.log(state);
            return React.createElement(component, state);
          }}
        </storeContext.Consumer>
      )
    }
  }
  

  return Connect;
}

export default connect;