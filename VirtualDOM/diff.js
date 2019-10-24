function getItemKey(item, key){
  if(!item || !key){
    return;
  }
  return typeof key === 'string'
    ? item[key]
    : key(item)
}

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
    keyIndex: keyIndex,
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
      debugger;
      let freeItem = newFree[freeIndex++];
      children.push(freeItem || null);
    }
    i++;
  }

  var simulateList = children.slice(0); // simulateList记录了从oldList->newList过程中，oldList中哪些位置的item要删除
  while(i < simulateList.length){
    if(simulateList[i] == null){
      remove(i);
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
          } else { // 否则执行插入操作
            inset(i, item);
          }
        }
      }
    } else {
      insert(i, item);
    }
    i++;
  }


  let k = simulateList.length - j; // simulateList的长度大于newList，则多出来的item直接删除即可
  while(j++ < simulateList.length){
    k--;
    remove(k + i);
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