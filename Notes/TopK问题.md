### TopK问题

#### 问题描述

> 输入n个整数，输出其中最小的K个。
>
> 例如：输入 [1, 3, 5, 7, 2]  2   =》输出 1 2

针对TopK有很多种解法，下面介绍两种。

#### 方法一：

把数组内数据进行排序，然后取最小的K个数。

首先，方法没问题。

但是，想一想，假如数据有好几万或者上亿条，排序消耗的时间就有点多了。如果仅仅是十几、几十条数据这种方法几乎是没问题的，但是，我们再想一想，我们有必要针对所有数据进行排序么？假如有10条数据，我们只需要最小的5条，我们只需要找出最小的5条数据出来就行了，剩下的5条数据大小我们完全可以不管。

#### 方法二：

针对方法一的缺点，现在提出第二种方法：部分排序。

如上所说的，我们只需要找出K个最小的数据，所以可以进行部分排序。比如__简单选择排序__和__冒泡排序__，这两者每一趟都能把一个最小/最大的数据放在最终位置上，所以进行K趟就能把n个数中的前K个排序出来。

__简单选择排序__：

```javascript
function select_sort(arr, K){
  var len = arr.length;
  var Min = 0;
  if(len < K){
      console.log("数组长度小于K");
      return;
  }
  for(var i = 0; i < K; ++i){
    Min = i;
 	for(var j = i + 1; j < len; ++j){
      if(arr[j] < arr[Min]){
        Min = j;
      }
 	}
    if(Min != i){
      var temp = arr[Min];
      arr[Min] = arr[i];
      arr[i] = temp;
    }
  }
  return arr;
}
```



__冒泡排序__：

```javascript
function bubble_sort(arr, K){
  var len = arr.length;
  for(var i = 0; i < K; i++){
 	var flag = false;
    for(var j = len - 1; j > i ; j--){
      if(arr[j] < arr[j - 1]){
        var temp = arr[j];
        arr[j] = arr[j - 1];
        arr[j - 1] = temp;
        flag = true;
      }
    }
    if(!flag){
       break;
    }
  }
  return arr;
}
```



以上。

