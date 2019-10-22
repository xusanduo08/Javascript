
/**
 * 深度优先编辑节点，并输出到数组中
 * @param {*} oldNode 
 * @param {*} newNode 
 * @param {*} index 
 */
export default function dfsWalk(oldNode, newNode, index){
  let newList = [];
  let oldList = [];

  function dfs(node){
    if(!Array.isArray(node)){
      node = [node];
    }
    let list = [];
    while(node.length > 0){
      let tmp = node.shift();
      list.push(tmp);
      if(tmp.props.children.length > 0){
        let childList = dfs(Array.from(tmp.props.children));
        list = list.concat(childList);
      }
    }
    return list;
  }

  newList = dfs(newNode);
  oldList = dfs(oldNode);

  return {
    newList,
    oldList
  }
}