/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
let REACT_STATICS = {
  childContextTypes: true,
  contextTypes: true,
  defaultProps: true,
  displayName: true,
  getDefaultProps: true,
  getDerivedStateFromProps: true,
  mixins: true,
  propTypes: true,
  type: true
};

let KNOWN_STATICS = {
  name: true,
  length: true,
  prototype: true,
  caller: true,
  callee: true,
  arguments: true,
  arity: true
};

let defineProperty = Object.defineProperty;
let getOwnPropertyNames = Object.getOwnPropertyNames;
let getOwnPropertySymbols = Object.getOwnPropertySymbols;
let getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
let getPrototypeOf = Object.getPrototypeOf;
let objectPrototype = getPrototypeOf && getPrototypeOf(Object);

export default function hoistNonReactStatics(targetComponent, sourceComponent, blacklist) {
  if(typeof sourceComponent !== 'string') {
    if(objectPrototype){
      let inheritedComponent = getPrototypeOf(sourceComponent); // 找到sourceComponent继承的祖先组件
      //Object.__proto__ === Function.prototype ==> true 如果一个组件对象的原型对象为Function.prototype，说明该组件没有继承任何组件。
      if(inheritedComponent && inheritedComponent !== objectPrototype) {  //存在祖先组件，则要把祖先组件上的静态属性复制到目标组件上。
        hoistNonReactStatics(targetComponent, inheritedComponent, blacklist);
      }
      let keys = getOwnPropertyNames(sourceComponent);

      if(getOwnPropertySymbols){
        keys = keys.concat(getOwnPropertySymbols(sourceComponent));
      }

      for(let i = 0; i < keys.length; i++){
        let key = keys[i];
        if(!REACT_STATICS[key] && !KNOWN_STATICS[key] && (!blacklist || !blacklist[key])){
          let descriptor = getOwnPropertyDescriptor(sourceComponent, key);
          try{
            defineProperty(targetComponent, key, descriptor);
          } catch(e){

          }
        }
      }
      return targetComponent;
    }
    return targetComponent;
  }
}