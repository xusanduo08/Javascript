import React from 'react';
import {Route, Link} from 'react-router-dom';
import Child2 from './Child2'

function Child1(props){
  console.log(props)
  return (
    <h2>
      This is Child1
      <Link to={`${props.match.url}/child2`}>showChild2</Link>
      <Route path={`${props.match.path}/child2`} component={Child2} />
    </h2>
  )
}

export default Child1;