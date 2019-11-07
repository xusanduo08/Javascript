export default function diffList(oldList, newList){
  // 比较两个list的差异
  // 按照索引去比较, 如果节点具有key属性的话，根据key比较，否则index做key
  // {type, props}
  let moves = [];
  let oldKeyMap = keyMap(oldList);
  let newKeyMap = keyMap(newList);

  let i = 0;
  let children = [];
  let nonKeyIndex = 0;
  let newCon = newKeyMap.con;
  while(i < oldList.length) {
    let item = oldList[i];
    if(item.props.key){
      if(!newKeyMap.hasOwnProperty(item.props.key)){ // 如果newList中不含有这个key，则oldList中对应的这个item需要删除
        children.push(null);
      } else {
        let newItemIndex = newKeyMap[item.props.key];
        children.push(newList[newItemIndex]);
      }
    } else {
      // 遇到没有key的item，按序从con中取出对应的元素放到children中
      // 这地方对于没有key的item的处理就是直接替换
      children.push(newCon[nonKeyIndex]);
      nonKeyIndex++;
    }
    i++;
  }


  let simulateList = children.slice(0);
  simulateList.forEach((item, index) => { // 过滤null，生成对oldList中元素的remove操作
    if(item == null){
      moves.push({type: 0, index});
      simulateList.splice(index, 1);
    }
  })

  let j = i = 0;
  while(i < newList.length){
    let item = newList[i];
    let itemKey = item.props.key;

    let simulateItem = simulateList[j];
    let simulateItemKey = simulateItem ? simulateItem.props.key : undefined; // 考虑simulateItem不存在的情况
    if(simulateItem){
      if(simulateItemKey === itemKey){ // 两者在相同位置的元素的key值相同，指针同时后移
        j++;
      } else {
        if(!oldKeyMap.hasOwnProperty(itemKey)){
          moves.push({type:1, index: i, item}); // oldList中就没有这个key，则插入
        } else {
          let nextItem = simulateList[j + 1];
          let nextItemKey = nextItem ? nextItem.props.key : undefined;
          if(nextItemKey === itemKey){
            moves.push({type: 0, index: i}); // 移除oldList中i位置的item
            simulateList.splice(j, 1);
            j++;
          } else {
            moves.push({type:1, index: i, item}); // 插入
          }
        }
      }
    } else {
      moves.push({type:1, index: i, item});
    }
    i++;
  }

  // 因为执行插入操作会让simulateList中有多出的节点，所以要进行删除操作
  let k = simulateList.length - j;
  while(j++ < simulateList.length){
    k--;
    moves.push({type: 0, index: k + i}); // 注意是 k+i，不是 k + j, i 表示此时此刻oldList中的索引情况
  }
  return {
    moves,
    children
  }
}



function keyMap(list){
  let map = {};
  let con = []; // 没有key属性的子元素，直接放到数组中，稍后按顺序比较
  list.forEach((item, index) => {
    if(item.props.key){
      map[item.props.key] = index;
    } else {
      con.push(item);
    }
  })

  return {
    keyMap: map,
    con
  };
}