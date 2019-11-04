
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

  return patches;
}

// 深度遍历两棵树
// 输入的两个节点都是属于同层、同位置的节点
function dfsWalk(oldTree, newTree, index, patches){
  let currentPatch = []; // 当前节点要做的变更
  if(newNode === null){
    // 删除旧节点
  } else if(){
    
  }
}