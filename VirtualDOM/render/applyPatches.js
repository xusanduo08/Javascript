import render from './render';

// 将变更实施到oldList上
let REPLACE = 0;
let REORDER = 1;
let PROPS = 2;
let TEXT = 3;

export default function patch(node, patches){
  // 深度遍历node，拿节点的index去patches取各自的变化
  let walker = {index: 0};
  dfsWalk(node, walker, patches);
}

function dfsWalk(node, walker, patches){
  let currentPatches = patches[walker.index];
  let len = (node.childNodes || []).length; // 这地方用childNodes，而不能用children，因为children不包括文本子节点
  for(let i = 0; i < len; i++){
    let child = node.childNodes[i];
    walker.index++;
    dfsWalk(child, walker, patches);
  }

  if(currentPatches){
    applyPatches(node, currentPatches);
  }
}

function applyPatches(node, currentPatches){
  currentPatches.forEach(patch => {
    switch(patch.type){
      case REPLACE: // 替换节点
        let newNode = render(patch.node);
        node.parentNode.replaceChild(newNode, node);
        break;
      case REORDER: // 针对子元素的删除和插入操作
        let moves = patch.moves;
        let children = node.childNodes;
        for(let i = 0; i < moves.length; i++){
          let move = moves[i];
          if(move.type === 1){ // 插入
            let newNode = render(move.item);
            node.parentNode.insertBefore(newNode, children[move.index]);
          } else if(move.type === 0){
            node.removeChild(children[move.index]);
          }
        }
        break;
      case PROPS:
        let props = patch.props;
        for(let key in props){
          if(props[key] === null){
            node.removeAttribute(key);
          } else {
            node.setAttribute(key, props[key]);
          }
        }
        break;

      case TEXT: // 更新文本内容
        node.nodeValue = patch.nodeValue;
    }
  })
}