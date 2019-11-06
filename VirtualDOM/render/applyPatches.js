// 将变更实施到oldList上
let REPLACE = 0;
let REORDER = 1;
let PROPS = 2;
let TEXT = 3;

function patch(node, patches){
  // 深度遍历node，拿节点的index去patches取各自的变化

}

function dfsWalk(node, walker, patches){
  let currentPatches = patches[walker.index];

  let len = node.children.length;
  for(let i = 0; i < len; i++){
    let child = node.children[i];
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
        let newNode = patch.node.type === 'TEXT_ELEMENT' 
          ? document.createTextNode(patch.node.props.nodeValue)
          : document.createElement(patch.node.type)
        node.parentNode.replaceChild(newNode, node);
        break;
      case REORDER: // 针对子元素的删除和插入操作
        let moves = patch.moves;
        let children = node.children;
        for(let i = 0; i < moves.length; i++){
          let move = moeves[i];
          if(move.type === 1){ // 插入
            let type = move.item.props.type;
            // TODO 创建节点不能只创建，还要把属性都添加上去
            let newNode = type === 'TEXT_ELEMENT'
              ? document.createTextNode(move.item.props.nodeValue)
              : document.createElement(type);
            node.parentNode.insertBefore(newNode, children[move.index]);

          } else if(move.type === 0){
            node.removeChild(children[i]);
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