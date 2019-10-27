import listDiff from './diff'

const PATCHES = {
  REPLACE: 0,
  REORDER: 1,
  PROPS: 2,
  TEXT: 3
}

function diffProps(oldNode, newNode){
  let count = 0;
  let oldProps = oldNode.props;
  let newProps = newNode.props;

  let key, value;
  let propsPatches = {};

  for(key in oldProps){ // 找出属性值有变更的属性
    value = oldProps[key];
    if(newProps[key] !== value && key !== 'children'){ // children属性不需要比较
      count++;
      propsPatches[key] = newProps[key];
    }
  }

  for(key in newProps){ // 找出新增的属性
    value = newProps[key];
    if(!oldProps.hasOwnProperty(key) && key !== 'children'){
      count++;
      propsPatches[key] = newProps[key];
    }
  }

  if(count === 0){
    return null;
  }
  return propsPatches;
}
/**
 * 
 * @param {*} oldTree 
 * @param {*} newTree 
 * 对两棵树进行比较，比较结果放在patches数组中，节点在深度遍历时的id用作patches的属性名，对应的属性值就是自己的修改和要对子元素进行的reorder修改（包括删除和插入）。
 * 返回的变更patches是针对oldTree的变更，所以，在深度遍历时，只要oldTree上的节点索引与patches内的变更对应好就可以。
 */
function diff(oldTree, newTree){
  let index = 0;
  let patches = {};
  dfsWalk(oldTree, newTree, index, patches);
  return patches;
}

function dfsWalk(oldNode, newNode, index, patches){
  let currentPatch = []; // 当前节点要做的变更
  if(newNode === null){
    // 节点需要删除
  } else if(oldNode.type === 'TEXT_ELEMENT' && newNode.type === 'TEXT_ELEMENT'){ // 都是文本节点
    if(newNode.props.nodeValue !== oldNode.props.nodeValue){ // 如果文本内容不一样的话，则替换，一样的话不用操作
      currentPatch.push({type: PATCHES.TEXT, content: newNode})
    }
  } else if(oldNode.type === newNode.type && oldNode.key === newNode.key){
    // 如果节点一样，则比较props和其下的子元素
    // 所有的不同都会放在以当前节点在深度遍历时对应id作为索引的数组元素中
    let propsPatches = diffProps(oldNode, newNode);
    if(propsPatches){
      currentPatch.push({type: PATCHES.PROPS, props: propsPatches})
    }
    // 比较子元素要做哪些删除/插入操作
    diffChildren(oldNode.props.children, newNode.props.children, index, patches, currentPatch);

  } else { // 两节点不一样，则直接替换
    currentPatch.push({type: PATCHES.REPLACE, node: newNode});
  }

  if(currentPatch.length){
    patches[index] = currentPatch;
  }
}

function diffChildren(oldChildren, newChildren, index, patches, currentPatch){
  let diffs = listDiff(oldChildren, newChildren);
  newChildren = diffs.children; // 这个children里包含了新旧列表中都存在的节点，null位置表示oldTree中要删除的节点

  if(diffs.moves.length){
    let reorderPatch = {type: PATCHES.REORDER, moves: diffs.moves}; // 这里面包含了删除/插入的操作
    currentPatch.push(reorderPatch);
  }

  let leftNode = null;
  let currentNodeIndex = index;

  // 开始递归比较oldChildren和newChildren
  oldChildren.forEach(function(child, i) {
    // 对于oldTree中存在的，但是newTree中不存在的节点，在相同位置，newTree中用null代替
    let newChild = newChildren[i]; //对新旧列表中都存在的节点的子节点再进行diff，新加入的节点肯定是不需要进一步diff的
    currentNodeIndex = (leftNode && leftNode.count)
      ? currentNodeIndex + leftNode.props.count + 1
      : currentNodeIndex + 1
    dfsWalk(child, newChild, currentNodeIndex, patches);
    leftNode = child;
  })


}

export default diff;