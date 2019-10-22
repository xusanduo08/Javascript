import newDOM from './new';
import oldDOM from './old';
import diff from './diff';
import dfs from './dfsWalk';

// 对新旧两棵树进行深度优先遍历
let {newList, oldList} = dfs(oldDOM, newDOM);
let moves = diff(oldList, newList);

console.log(moves);

