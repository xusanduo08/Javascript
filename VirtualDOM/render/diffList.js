export default function diffList(oldList, newList){
  // 比较两个list的差异
  // 按照索引去比较, 如果节点具有key属性的话，根据key比较
  // {type, props}
  let oldKeyMap = keyMap(oldList);
  let newKeyMap = keyMap(newList);

}

function keyMap(list){
  let map = {};
  list.forEach((item, index) => {
    map[item.props.key || index] = item;
  })

  return map;
}