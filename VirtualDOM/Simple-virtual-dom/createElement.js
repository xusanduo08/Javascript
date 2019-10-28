
export default function createElement(type, config, ...args){
  const props = Object.assign({count: 0}, config);
  const hasChildren = args.length > 0;
  const rawChildren = hasChildren ? [].concat(...args) : [];
  
  props.children = rawChildren.filter(c => c != null && c != false)
    .map(c => {
      if(c instanceof Object){
        props.count = c.props.count + 1; // count属性记录了当前节点下所有子节点的数量，包括孙子节点、曾孙子节点等等哦~
      } else {
        props.count ++;
      }
      return c instanceof Object ? c: createTextElement(c);
    });
  return {type, props};
}

function createTextElement(value){
  return createElement('TEXT_ELEMENT', {nodeValue: value});
}