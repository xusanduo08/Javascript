import diffList from './diffList';
import {dfsWalk} from './diff';

export default function diffChildren(oldChildren, newChildren, index, patches, currentPatches){
  // 比较当前层节点要做的插入和删除操作
  // 同时对oldNode和newNode中都存在的节点进行diff
  let diffs = diffList(oldChildren, newChildren); // 同层节点的比较
  newChildren = diffs.children; // oldNode和newNode中都存在的节点，值为null的则表示oldNode中对应位置的元素要删除
  /**
   * diffs:{
   *  moves: [],
   *  children: []
   * }
   */
  if(diffs.moves.length){
    currentPatches.push({type: 1, moves: diffs.moves}); // 包含对当前层子节点的删除/插入操作，如果没有删除或者插入，也存在属性需要更新的可能
  }

  let currentIndex = index;
  // 接下来对oldNode和newNode中都存在的节点进行diff
  oldChildren.forEach((child, i) => {
    let leftNode = null;
    // 计算当前节点在深度遍历时的索引
    currentIndex = leftNode && leftNode.count 
      ? currentIndex + leftNode.count + 1
      : currentIndex + 1
    leftNode = child;
    dfsWalk(child, newChildren[i], currentIndex, patches);
  })
}