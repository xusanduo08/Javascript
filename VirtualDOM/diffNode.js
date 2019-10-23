import listDiff from './diff'

const patch = {
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
    if(newProps[key] !== value){
      count++;
      propsPatches[key] = newProps[key];
    }
  }

  for(key in newProps){ // 找出新增的属性
    value = newProps[key];
    if(!oldProps.hasOwnProperty(key)){
      count++;
      propsPatches[key] = newProps[key];
    }
  }

  if(count === 0){
    return null;
  }
  return propsPatches;
}

function diff(oldTree, newTree){
  let index = 0;
  let patches = {};
  dfsWalk(oldTree, newTree, index, patches);
  return patches;
}

function dfsWalk(oldNode, newNode, index, patches){
  let currentPatch = [];
  if(newNode === null){
    // 节点需要删除
  } else if(typeof oldNode === 'string' && typeof newNode === 'string'){ // 都是文本节点
    if(newNode !== oldNode){ // 如果文本内容不一样的话，则替换，一样的话不用操作
      currentPatch.push({type: patches.TEXT, content: newNode})
    }
  } else if(oldNode.type === newNode.type && oldNode.key === newNode.key){ // 如果节点一样，则比较props
    let propsPatches = diffProps(oldNode, newNode);
    if(propsPatches){
      currentPatch.push({type: patch.PROPS, props: propsPatches})
    }

    diffChildren(oldNode.children, newNode.children, index, patches, currentPatch);

  } else { // 两节点不一样，则直接替换
    currentPatch.push({type: patch.REPLACE, node: newNode})
  }

  if(currentPatch.length){
    patches[index] = currentPatch;
  }
}

function diffChildren(oldChildren, newChildren, index, patches, currentPatch){
  let diffs = listDiff(oldChildren, newChildren, 'key');
  newChildren = diffs.children; // 这个children里包含了新旧列表中都存在的节点

  if(diffs.moves.length){
    let reorderPatch = {type: patch.REORDER, moves: diffs.moves}; // 这里面包含了删除，插入的操作
    currentPatch.push(reorderPatch);
  }

  let leftNode = null;
  let currentNodeIndex = index;

  oldChildren.forEach(function(child, i) {
    let newChild = newChildren[i]; //对新旧列表中都存在的节点的子节点再进行diff，新加入的节点肯定是不需要进一步diff的
    currentNodeIndex = (leftNode && leftNode.count)
      ? currentNodeIndex + leftNode.count + 1
      : currentNodeIndex + 1
    dfsWalk(child, newChild, currentNodeIndex, patches);
    leftNode = child;
  })


}