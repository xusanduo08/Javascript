function getItemKey(item, key){
  if(!item || !key){
    return;
  }
  return typeof key === 'string'
    ? item[key]
    : key(item)
}

/**
 * 将item在list中的索引存储到keyIndex这个对象中，属性名根据item自身生成
 * @param {} list 
 * @param {*} key 
 * 
 */
function makeKeyIndexAndFree(list, key){
  let keyIndex = {};
  let free = [];

  for(let i = 0, len = list.length; i < len; i++){
    let item = list[i];
    let itemKey = getItemKey(item, key);

    if(itemKey){
      keyIndex[itemKey] = i;
    } else {
      free.push(item);
    }
  }
  return {
    keyIndex: keyIndex, // item => index 映射
    free: free
  }
}

function diff(oldList, newList, key){
  let oldMap = makeKeyIndexAndFree(oldList, key);
  let newMap = makeKeyIndexAndFree(newList, key);

  let newFree = newMap.free;

  let oldKeyIndex = oldMap.keyIndex; // {itemKey:index}
  let newKeyIndex = newMap.keyIndex;

  let moves = [];

  let children = [];
  let i = 0;
  let item;
  let itemKey;
  let freeIndex = 0;

  // 查看是否有已经移除的item
  while(i < oldList.length){
    item = oldList[i];
    itemKey = getItemKey(item, key);
    if(itemKey){
      if(!newKeyIndex.hasOwnProperty(itemKey)){
        children.push(null); // 新list中已经移除了这个item，则在相同位置放置一个null
      } else {
        let newItemIndex = newKeyIndex[itemKey]; // 取出当前item在新list中的index
        children.push(newList[newItemIndex]); // 取出新list中的item，放入到children中
      }
    } else {
      let freeItem = newFree[freeIndex++];
      children.push(freeItem || null);
    }
    i++;
  }

  // children的长度和oldList长度一致，且内部的非null元素都是oldList和newList同时都含有的元素
  // children中值为null的元表示oldList中相同位置的元素需要删除

  var simulateList = children.slice(0);
  while(i < simulateList.length){
    if(simulateList[i] == null){
      remove(i); // 记录删除操作
      removeSimulate(i);
    } else {
      i++;
    }
  }

  // 此时simulateList中都是非null且在newList中也存在的元素
  // i指向新列表中的item
  // j指向假列表中的item
  let j = i = 0;
  while(i < newList.length){
    item = newList[i];
    itemKey = getItemKey(item, key);

    let simulateItem = simulateList[j];
    let simulateItemKey = getItemKey(simulateItem, key);

    if(simulateItem){
      if(itemKey === simulateItemKey){
        j++; // 两者在相同位置的item相同，当前这个item不需要做变更
      } else {
        if(!oldKeyIndex.hasOwnProperty(itemKey)){
          insert(i, item); // 旧list中不含有这个item，说明是新增加的，执行插入操作
        } else {
          // 新旧list中都有这个item，但两者不在同一位置出现
          let nextItemKey = getItemKey(simulateList[j + 1], key); // 如果下一个item等于新list中当前item，则移除旧list中当前的item
          if(nextItemKey === itemKey){
            remove(i); // 为什么是remove(i)？因为前面的插入操作，所以到i位置之前，oldList和newList的都是一样的，又因为插入时j不变，所以下一轮循环后，j位置的item在oldList中的索引和i相同
            removeSimulate(j);
            j++;
            // 上面移除之后为什么还要j++ ? 因为j+1 和 i位置的item相同，移除 j 之后，j + 1 位置的item索引变成 j，此时 j 和 i 位置的item相同，所以 j++，比较下一个item就可以了
          } else { // 否则执行插入操作
            inset(i, item); // 如果两者都有的话，直接插入一个节点oldTree最终不就多出一个节点么 ？多出的节点在最后删除
          }
        }
      }
    } else {
      insert(i, item);
    }
    i++;
  }

  // j表示simulateList中被复用的节点的个数，剩下的节点需要删除
  // 按理说，simulateList中不都是新旧list中都存在的节点么，为什么还要删除？
  // 因为在比较时有额外的插入操作产生，导致simulateList中有多出的节点
  let k = simulateList.length - j; // 剩余元素的个数+1
  while(j++ < simulateList.length){
    k--;
    remove(k + i); // k + i 为多出的item在oldTree中的索引，注意这地方是 k + i，不是k + j
  }

  function remove(index){
    let move = {index: index, type: 0};
    moves.push(move);
  }

  function insert(index, item){
    let move = {index: index, item: item, type: 1};
    moves.push(move);
  }

  function removeSimulate(index){
    simulateList.splice(index, 1);
  }

  return {
    moves: moves,
    children: children
  }
}

export default diff;