/**@jsx createElement */
let dom = <div>1234</div>
let root = document.createElement('div');
document.body.appendChild(root);
render(dom, root);
class Test extends Comment{
  constructor(props){
    super(props);
  }
  render(){
    return <div>1234<span>span</span></div>
  }
}
render(<Test />, root);

// createElement
function createElement(type, config, ...args){
  const props = Object.assign({}, config);
  let children = args.length ? [].concat(args) : [];

  props.children = children.filter(c => c != null && c != false)
    .map(c => c instanceof Object ? c : createTextElement(c));

  return {type, props};
}

function createTextElement(value){
  return createElement('TEXT_ELEMENT', {nodeValue: value});
}


/**
 * {
 *   type,
 *   props:{
 *     children
 *   }
 * }
 */
let prevInstance = null;
function render(element, parentDOM){
  prevInstance = reconcile(parentDOM, prevInstance, element);
}

/**
 * 
 * @param {*} parentDOM 
 * @param {*} instance 
 * @param {*} element 
 * {
 *    dom,
 *    element,
 *    childInstance
 * }
 */
function reconcile(parentDOM, instance, element){
  if(instance == null){
    instance = instantiate(element);
    parentDOM.appendChild(instance.dom);
    return instance;
  } else if(element == null){
    instance.dom.parentNode.removeChild(instance.dom);
    return null;
  } else if(instance.element.type !== element.type){
    let newInstance = instantiate(element);
    parentDOM.replaceChild(newInstance.dom, instance.dom);
    return newInstance;
  } else if(typeof element.type === 'string'){
    updateProperties(instance.dom, instance.element.props, element.props);
    instance.childInstances = reconcileChildren(instance, element);
    return instance;
  } else { // type相等且不是字符串，则只能是类组件了
    instance.publicInstance.props = element.props;
    const childElement = instance.publicInstance.render();
    const oldChildInstance = instance.childInstance;
    const childInstance = reconcile(parentDOM, oldChildInstance, childElement);

    instance.dom = childInstance.dom;
    instance.childInstance = childInstance;
    instance.element = element;
    return instance;
  }
}

function instantiate(element){
  const {type, props} = element;
  if(typeof type === 'string'){
    let dom = type === 'TEXT_ELEMENT' 
      ? document.createTextNode(props.nodeValue)
      : document.createElement(type);
    updateProperties(dom, [], props);
    let children = props.children || [];
    let childInstances = children.map(child => instantiate(child));
    childInstances.forEach(childInstance => dom.appendChild(childInstance.dom));

    return {dom, element, childInstances}
  } else {
    const instance = {};
    const publicInstance = createPublicInstance(element, instance);
    const childElement = publicInstance.render();
    const childInstance = instantiate(childElement);
    const dom = childInstance.dom;

    Object.assign(instance, {dom, publicInstance, childInstance, element});
    return instance;
  }
  
}

function reconcileChildren(instance, element){
  let childInstances = instance.childInstances;
  let children = element.props.children || [];
  const count = Math.max(childInstances.length, children.length);
  let newChildInstances = [];
  for(let i = 0; i < count; i++){
    newChildInstances.push(reconcile(instance.dom, childInstances[i], children[i]));
  }
  
  return newChildInstances.filter(instance => instance != null);
}

function updateProperties(dom, prevProps, nextProps){
  Object.keys(prevProps).forEach(key => {
    if(key.startsWith('on')){
      let eventType = key.toLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[key]);
    } else if(key !== 'children') {
      dom[key] = null;
    }
  });

  Object.keys(nextProps).forEach(key => {
    if(key.startsWith('on')){
      let eventType = key.toLowerCase().substring(2);
      dom.addEventListener(eventType, nextProps[key]);
    } else if(key !== 'children'){
      dom[key] = nextProps[key];
    }
  });
}

// 类组件的处理，对于类，首先要创建类的实例，调用实例的render方法返回childElement
// 公共实例的内部实例就是由element，childInstance.dom，childInstance，publicInstance组成
// 类组件的更新，就是更新内部实例
class Component {
  constructor(props){
    this.props = props;
    this.state = this.state || {};
  }

  setState(partialState){
    this.state = Object.assign({}, this.state, ...partialState);
    updateInstance(this.__internalInstance);
  }
}

function createPublicInstance(element, internalInstance){
  const {type, props} = element;
  console.log(type)
  const publicInstance = new type(props);

  publicInstance.__internalInstance = internalInstance;
  return publicInstance;
}

function updateInstance(internalInstance){
  const parentDOM = internalInstance.dom.parentNode;
  const element = internalInstance.element;
  reconcile(parentDOM, internalInstance, element);
}