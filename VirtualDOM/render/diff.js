import diffProps from './diffProps';
import diffChildren from './diffChildren';

const PATCHES = { // 几种操作类型
  REPLACE: 0,
  REORDER: 1, // 子元素的重新编排
  PROPS: 2,
  TEXT: 3
}

// 两棵DOM树的diff算法
export default function diff(oldTree, newTree){
  // 只比较同层节点
  // 暂时只考虑删除和增加节点
  let index = 0;
  let patches = {};
  dfsWalk(oldTree, newTree, index, patches);
  return patches;
}

// 深度遍历两棵树
// 输入的两个节点都是属于同层、同位置的节点
export function dfsWalk(oldNode, newNode, index, patches){
  let currentPatch = []; // 当前节点要做的变更
  if(newNode === null){
    // 删除旧节点
  } else if(oldNode.type === 'TEXT_ELEMENT' && newNode.type === 'TEXT_ELEMENT'){ // 如果是文本节点
    if(oldNode.props.nodeValue !== newNode.props.nodeValue){
      currentPatch.push({type: PATCHES.TEXT, nodevalue: newNode.props.nodeValue});
    }
  } else if(oldNode.type === newNode.type){ // 如果两个节点类型一致，则比较两者的props和children

    let propsPatches = diffProps(oldNode, newNode); // 比较属性的变化
    if(propsPatches){
      currentPatch.push({type: PATCHES.PROPS, props: propsPatches});
    }
    
    //diffChildren -> 得出下一层子元素需要做的插入和删除操作，同时递归diff子节点中的每个节点
    diffChildren(oldNode.props.children, newNode.props.children, index, patches, currentPatch);
  } else { // 最后一种情况就是两节点类型不一样，这种情况直接替换
    currentPatch.push({type: PATCHES.REPLACE, node: newNode})
  }

  if(currentPatch.length){
    patches[index] = currentPatch;
  }
}