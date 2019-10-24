let REPLACE = 0;
let REORDER = 1;
let PROPS = 2;
let TEXT = 3;

function patch(node, patches){
  let walker = {index: 0};
  dfsWalk(node, walker, patches);
}

function dfsWalk(node, walker, patches){
  let currentPatches = patches[walker.index];

  let len = node.childNodes 
    ? node.childNodes.length
    : 0;
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
  currentPatches.forEach(function(currentPatch){
    switch(currentPatch.type){
      case REPLACE:
        let newNode = (typeof currentPatch.node === 'string')
          ? document.createTextNode(currentPatch.node)
          : currentPatch.node.render()
        node.parentNode.replaceChild(newNode, node);
        break;
      case REORDER:
        reorderChildren(node, currentPatch.moves);
        break;
      case PROPS:
        setProps(node, currentPatch.props);
        break;
      case TEXT:
        if(node.textContent){
          node.textContent = currentPatch.content
        } else {
          node.nodeValue = currentPatch.content
        }
        break;
      default:
        throw new Error('Unknown patch type ' + currentPatch.type);
    }
  })
}

function setProps(node, props){
  for(let key in props){
    if(props[key] == null){
      node.removeAttribute(key);
    } else {
      let value = props[key];
      node.setAttribute(key, value);
    }
  }
}

function reorderChildren(node, moves){
  let staticNodeList = Array.prototype.slice.call(node.childNodes, 0);
  let maps = {};
  staticNodeList.forEach(function(node){
    if(node.nodeType === 1){ // ELEMENT_NODE 一个元素节点
      let key = node.getAttribute('key');
      if(key){
        maps[key] = node;
      }
    }
    moves.forEach(function(move){
      let index = move.index;
      if(move.type === 0){ // remove item
        if(staticNodeList[index] === node.childNodes[index]){
          node.removeChild(node.childNodes[index]);
        }
        staticNodeList.splice(index, 1);
      } else if(move.type === 1){
        let insertNode = maps[move.item.key]
          ? maps[move.item.key].cloneNode(true)
          : (typeof move.item === 'object')
            ? move.item.render()
            : document.createTextNode(move.item);
        staticNodeList.splice(index, 0, insertNode);
        node.insertBefore(insertNode, node.childNodes[index] || null);
      }
    })
  })
}