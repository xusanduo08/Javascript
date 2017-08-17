### 广度优先的DOM树遍历

```html
<div class="root">
    <div class="container">
        <section class="sidebar">
            <ul class="menu"></ul>
        </section>
        <section class="main">
            <article class="post"></article>
            <p class="copyright"></p>
        </section>
    </div>
</div>
```

对上面的DOM树进行广度优先的遍历，遍历到每个节点时，打印出当前节点的类型及类名，例如，上面DOM树广度优先遍历结果为：

```
DIV root
DIV container
SECTION sidebar
SECTION main
UL menu
ARTICLE post
P copyright
```

__广度优先遍历需要使用队列数据结构来管理待遍历的节点__

代码实现：

```javascript
const traverse = (ndRoot) => {
const queue = [ndRoot];

  while (queue.length) {
    const node = queue.shift();

    printInfo(node);

    if(!node.children.length) {
    continue;
    }

    Array.from(node.children).forEach(x => queue.push(x));
  }
};

const printInfo = (node) => {
	console.log(node.tagName, `${node.className}`);
}

traverse(document.querySelector(".root"));
```

补充：

- childNodes返回的是节点的子节点集合，包括元素节点、文本节点还有属性节点。
- children返回的只是节点的元素节点集合。



__增加深度优先遍历的代码__：

```javascript
var t = document.querySelector(".root")
var stack = [];
stack.push(t);
var node;
while(stack.length != 0){
  node = stack.pop();
  console.log(node.tagName, node.className;
  if(!node.children.length){
    continue;
  } 
  Array.from(node.children).forEach( x => stack.push(x));
}
```

上面的代码没有按照从上至下，从左到右的顺序遍历，修改成如下代码，__使用递归__：

```javascript
//使用递归
var t = document.querySelectorAll(".root");
function DeepthFirst(t){			
	while(t.length != 0){
      node = t.shift();
      console.log(node.tagName, node.className);
      if(node.children.length != 0){
          DeepthFirst(Array.from(node.children))
      } 
	}
}
DeepthFirst(Array.from(t));

/*
DIV root
DIV container
SECTION sidebar
UL menu
SECTION main
ARTICLE post
P copyright

*/
```



