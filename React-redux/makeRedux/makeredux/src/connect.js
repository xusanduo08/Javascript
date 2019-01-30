import React from 'react';

function connect(storeContext, component) {
  

  class Connect extends React.Component {
    constructor(props, context){
      super(props, context);
      this.context.store.subscribe(()=> this.setState({}));
    }

    render() {
      const state = this.context.store.getState();
      return React.createElement(component, state);
    }
  }
  Connect.contextType = storeContext;

  return Connect;
}

export default connect;