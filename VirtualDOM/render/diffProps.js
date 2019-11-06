export default function diffProps(oldNode, newNode){
  // 比较属性的变更
  // 已经不存在的属性，要删除
  // 属性值已经改变的，要更新
  // 新增的属性，要添加
  // 直接返回一个对象，这个对象上的所有非null的属性都要添加到oldNode上
  let oldProps = oldNode.props;
  let newProps = newNode.props;
  let flag = false;

  let propsPatches = {};
  for(let key in newProps){
    let value = newProps[key];

    if(oldProps.hasOwnProperty(key) && oldProps[key] !== value && key !== 'children'){ // oldNode上也存在这个属性，但属性值已经变更 -> 更新属性值
      flag = true;
      propsPatches[key] = value;
    } else if(!oldProps.hasOwnProperty(key) && key !== 'children'){ // 新增的属性
      flag = true;
      propsPatches[key] = value;
    }
  }
  for(let key in oldProps){
    if(!newProps.hasOwnProperty(key)){
      propsPatches[key] = null; // 不存在的属性要进行删除
    }
  }

  return  flag ? propsPatches : null; // 没有属性变更的话返回null
}