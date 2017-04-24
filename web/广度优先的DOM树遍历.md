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

__如果是深度有点遍历（DFS），使用递归即可，但是广度优先遍历则需要使用队列数据结构来管理待遍历的节点__

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