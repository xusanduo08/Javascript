import React from 'react';
import {reduxContext} from './reduxContext';

function connect(component) {
  
  class Connect extends React.Component {

    render() {
      return (
        <reduxContext.Consumer>
          {({state}) => {
            return React.createElement(component, state);
          }}
        </reduxContext.Consumer>
      )
    }
  }

  return Connect;
}

export default connect;