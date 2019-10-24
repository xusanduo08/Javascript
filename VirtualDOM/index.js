import newDOM from './new';
import oldDOM from './old';
import diff from './diff';
import dfs from './dfsWalk';
import diffNode from './diffNode'

// 对新旧两棵树进行深度优先遍历
console.log(oldDOM, newDOM);
let patches = diffNode(oldDOM, newDOM);
// let moves = diff(oldList, newList);

console.log(patches);

