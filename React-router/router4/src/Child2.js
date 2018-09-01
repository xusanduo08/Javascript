import React from 'react';

function Child2 ({match}){
  console.log(match.params.id)
  return (
    <div>
      <h2>This is Child2</h2>  
    </div>
    
  )
}

export default Child2;