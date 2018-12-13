#### React元素（ReactElement）

这里提到的react元素是和原生的DOM元素相并列的。

我们在写react的时候肯定会使用JSX语法，一种在js中混入html的写法：

```jsx
function(){
    return (
    	<div>This is JSX</div>
    )
}
```

我们知道JSX是`React.createElement`的语法糖，上面的代码其实和下面的等效：

```javascript
function(){
    return React.createElement(div, {/*props*/}, 'This is JSX')
}
```

`React.createElement`方法返回的就是react元素（reactElement）。上面的函数最终返回的react元素如下：

```javascript
{
    type:'div',
    props:{
        children:['This is JSX']
    }
}
```

上面的就是代表实际DOM的虚拟DOM（Virtual DOM）。虚拟DOM可以嵌套：

```javascript
{
    type:'div',
    props:{
        children:[
            {type:'div', props:{children:'xxx'}},
            {type:'span', props:{children:[
                {type:'button', props:{...}}
            ]}}
        ]
    }
}
```

最终上面的结构就是一颗虚拟DOM树，对应的就是真实的DOM树。react中对DOM的一些更新操作都会先在虚拟DOM树上进行，计算出最小的变动然后实现到真实的DOM树上。

__一个react组件本质上都可以看成是以props为输入，react元素为输出的。__

`ReactDOM.render(reactElement, container)`方法负责将虚拟DOM渲染成真实的在浏览器中展示的DOM。

