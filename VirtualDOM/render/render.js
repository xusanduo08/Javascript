// 将Virtual DOM 渲染到页面
export default function render({type, props}, parentDOM){
  let dom = null;
  if(type !== 'TEXT_ELEMENT'){
    dom = document.createElement(type);
  } else {
    dom = document.createTextNode(props.nodeValue);
  }

  for(let key in props){
    if(key !== 'children' && type !== 'TEXT_ELEMENT'){
      console.log(dom, props)
      dom.setAttribute(key, props[key]);
    }
  }

  if(props.children.length > 0){
    props.children.forEach(child => {
      render(child, dom);
    })
  }

  parentDOM.appendChild(dom);
}