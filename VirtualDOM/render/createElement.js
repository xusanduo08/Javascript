// 将JSX转成Virtual DOM
export default function createElement(type, config, ...args){
  let props = Object.assign({count:0}, config);

  let children = args.filter(c => c != null)
    .map(c => {
      if(c instanceof Object){
        props.count = c.props.count + 1; // 计算子孙节点个数,便于后面深度遍历时计算节点索引
      } else {
        props.count++;
      }
      return c instanceof Object ? c : createTextElement(c)
    })
  props.children = children;
  return {type, props}
}

function createTextElement(value){
  return createElement('TEXT_ELEMENT', {nodeValue: value});
}