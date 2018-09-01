import React from 'react';
import {Route, Link} from 'react-router-dom';


function Child(props){
  console.log(props)
  return (
    <h2>
      This is Child
      
    </h2>
  )
}

export default Child;