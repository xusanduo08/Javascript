#### React Hook

React在18年十月底发布了16.7.0-alpha版本，里面包含了一个重要的更新就是hooks。说白了，hooks的作用就是能使你在不使用class创建组件的情况下正常使用state以及在之前版本中其他class组件才有的一些特性。

在介绍hook之前有个问题需要先明白。

##### 为什么需要hook？

1.组件之间状态化的逻辑难以复用

React本身并没有现成的方法来使得组件之间共享含有状态的逻辑。现有情况下，我们通常会用[render props](https://reactjs.org/docs/render-props.html)或者[HOC](https://reactjs.org/docs/higher-order-components.html)来实现一些逻辑的复用，但这两种方法在使用时都需要对组件结构做一些变更，这导致最终的组件有些笨重，而且也由于组件的嵌套，容易造成“嵌套地狱”（wrapper hell）。当组件嵌套层级很深时，数据的追踪也会有一些困难。所以说，React需要一种可以共享状态逻辑的方法。

2.复杂的组件比较难理解

在刚开始时，组件往往都比较简单，随着需求的增加，组件内部会增加各种逻辑和副作用，各个生命周期内部也会包含各种互不相干的逻辑。例如在某种需求下，我们在`componentDidMount`和`componentDidUpdate`中添加了请求数据的逻辑，在`componentDidMount`中添加了事件绑定的逻辑，为了防止内存泄漏，我们又在`componentWillUnmount`中添加了解绑该事件的逻辑。可以看到，相互之间没有关系的逻辑（请求数据和绑定事件）放到了一个方法中，而有关系的逻辑（事件的绑定和解绑）却被分开----这容易导致bug产生，同时也会让测试难以进行。

当组件内部的逻辑比较复杂时，我们首先想到的是拆分组件，但当组件各个声明周期都含有逻辑的时候往往组件也比较难以进行拆分。有些人喜欢使用状态管理工具（比如redux）来避免组件内部含有过多逻辑，但使用这些状态管理工具一般需要对逻辑进行更好的抽象，同时需要将生命周期的考虑在内。即使这些都做到了，也还会带来问题----组件会变得难以复用。

3.什么时候用class，什么时候用function？

首先，javascript中的this和其他语言的this在理解上有较大差别，从某种意义上增加了学习和使用class的负担；而且，当使用class定义组件的时候，如果组件中有事件处理函数，可能还需要额外的进行bind操作，这其实有点啰嗦。function组件和class组件之间的区别以及何时使用它们当中的某一个一直有一些争议。

此外，React在尝试对组件进行预打包和优化时发现class组件会有些意想不到的情况出现，使得优化效果不那么明显。对于当下出现的一些工具来讲，class组件不能被彻底压缩，还会使热加载变得怪异和不可靠。



以上三条就是React hook出现的原因，有了hook之后我们可以：

1.不用再进行function组件到class组件的改造：之前是只有class组件才有state和生命周期方法，现在有了hook之后，function组件也可以使用state和生命周期。有了hook之后，不用为了使用state和生命周期再去把function组件改造成class组件了。而且function组件也比class组件更轻量一些。

2.副作用可以更好的划分：之前副作用都是放在生命周期方法中的，并且一些副作用需要设置和清除两个阶段，而这两个阶段常被放置在不同的生命周期方法中。现在有了hook之后，一个副作用可以对应一个`useEffect`，并且设置和清除都可以放置这一个hook中。

3.不再需要嵌套组件以共享逻辑：含有状态的一些逻辑可以抽取出来，很好的避免了HOC和render-props造成的'wrapper hell'。

4.一定程度上降低React的学习成本：因为hook使得function组件就可以满足大部分的需求，所以React也就不需要每个人都对javascript中的class有很好的理解（尤其对那些刚接触js和React的人）。在写代码时也不会去纠结到底该用function组件还是class组件。

React hook的出现并不会改变开发者对React的已经存在的一些理解，而且React也并没有计划去移除class。

##### 什么是hook

hook，从字面理解有“钩子”的含义。放在这里我们可以理解为，hook犹如一个钩子一样----通过hook，我们能进入到React内部，使用React的一些特性。

hook能让你在不使用class组件时正常使用state、生命周期、context以及其他class组件才能用的一些React特性。

下面开始看hook的使用。

##### State Hook

当我们使用function定义组件时，我们可以这么在组件中使用状态：

```javascript
import { useState } from 'react';

function Example(){
    const [count, setCount] = useState(0);
    
    return (
    	<div>
    		<p>You clicked {count} time</p>
    		<button onClick={() => setCount(count+1)}>
    			Click me
    		</button>
    	</div>
    );
}
```

这里，`useState`就是一个Hook。在上面的例子中，我们在function组件内部调用了`useState`来给组件增加状态，在re-render的时，React会去获取当前的state值并进行相应的渲染。`useState`方法会返回当前的状态值以及设置状态值的方法，这个方法和`class`组件中的`this.setState`有些类似，有一个不同点就是它不会将新旧state进行合并（merge）。

`useState`只有一个参数，是状态的初始值。在上面的例子中，0就是初始状态值。这里有个地方要提一下，class组件中`this.state`往往指向的是一个对象，而这地方使用`useState`创建的state则不必是对象。`useState`中传入的初始值会在组件第一次渲染时被用到。

在一个组件中我们可以多次调用同一个hook：

```javascript
function ExampleWithManyStates(){
    const [age, setAge] = useState(42);
    const [fruit, setFruit] = useState('banana');
    const [todos, setTodos] = useState({text: 'Learn Hooks'});
}
```

数组的解构赋值使得我们可以给我们需要的state定义不同的变量名。

##### Effect Hook

有时候我们在组件中会去请求数据、订阅某些信息、或者去变更DOM，我们把这些操作统一称为“副作用”（side effects）。这些行为都有可能会对组件的渲染造成影响，同时在组件渲染时这些行为又不会立刻完成。

针对副作用有个专门的hook，叫`useEffect`，通过`useEffect`可以在function组件中很方便的添加副作用。默认情况下，它的触发时机和class组件中`componentDidMount`、`componentDidUpdate`以及`componentWillUnMount`(会触发清除effect的操作)几个生命周期的触发时机一致（可以把`useEffect`当成是上面三个生命周期的合并）。

下面的组件在每次更新后都会重新设置document title：

```jsx
import { useState, useEffect } from 'react';

function Example(){
    const [count, setCount] = useState(0);
    
    // 触发时机和componentDidMount、componentDidUpdate一致
    useEffect(() => {
        document.title == `You clicked ${count} times`;
    });
    
    return (
    	<div>
    		<p>You clicked {count} times</p>
    		<button onClick={()=>setCount(count+1)}>
    			Click me
    		</button>
    	</div>
    )
}
```

调用`useEffect`其实也就是在告诉React当变更实施到DOM上之后要调用这些副作用（包括第一次渲染之后也会执行这些副作用）。

`useEffect`也可以返回一个函数，这个函数可以用来“清除”副作用：

```javascript
import {useState, useEffect} from 'react';

function FriendStatus(props){
    const [isOnline, setIsOnline] = useState(null);
    
    function handleStatusChange (status){
        setIsOnline(status.isOnline);
    }
    
    useEffect(() => {
    	// 订阅
        ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
        // 返回的函数用来取消订阅，在组件卸载前和下次执行effect前调用
        return () => {
            ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
        };
    });
    
    if(isOnline === null){
        return 'Loading...'
    }
    return isOnline ? 'Online' : 'Offline';
}
```

在上面的例子中，React会在组件卸载前和下次执行effect前去取消对`ChatAPI`的订阅。

在组件中可以多次调用`useEffect`，这点和`useState`一样。

__React会在挂载后，更新后执行effect，会在卸载前和下次执行effect前执行effect中返回的清除effect的操作以清除上一个effect。__

__根据功能去划分effect，不同功能的effect放在不同的effect hook中，React会按照声明的顺序来调用它们。__



每次更新都执行effect在某些情况有些浪费性能，我们可以通过给`useEffect`传递第二个参数的方法来告知React当某些值改变时再去执行effect。第二个参数为一个数组，数组元素为用来判断是否需要执行effect的变量：

```javascript
useEffect(() => {
    document.title = `You clicked ${count} time`
}, [count]);// count发生变化时才执行effect
```

在上面例子中，在某次re-render之后，React会去比较当前的count和之前的count是否发生变化，如果有变化就会执行effect，没有变化则不执行。数组中可以传入多个元素，当其中有一个发生变化时React就会去执行effect。

##### Rules of Hooks

Hook使用起来就是普通的函数，但有两条引用规则：

* 在组件头部调用hook，不要在循环语句、条件语句或者嵌套函数中调用。
* 只能在React的function组件（常说的无状态组件）中调用hook，在一般的函数中不要调用。（__自定义hook除外__）

##### 自定义hook

含有状态的逻辑如果想复用的话传统的做法是使用高阶组件或者render-props，现在可以使用自定义hook来实现这样的需求。

再看下上面那个例子，`FriendStatus`内部调用了`useState`和`useEffect`两个hook实现了对好友状态的订阅和显示。现在我们来自定义一个hook，使订阅逻辑也可以在其他组件中使用。

```jsx
import {useState, useEffect} from 'react';

function useFriendStatus(friendID){
    const [isOnline, setIsOnline] = useState(null);
    function handleStatusChange(status){
        setIsOnline(status.isOnline);
    }
    
    useEffect(() => {
        ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
        return ()=>{
            ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
        }
    })
    return isOnline;
}
```

上面是一个自定义的hook，以一个friendID为入参。自定义hook其实就是一个普通的函数，只不过里面可以调用hook（`useState`）。

看下在组件中如何使用：

```jsx
function FriendStatus(props){
    const isOnline = useFriendStatus(props.friend.id);
    if(isOnline === null){
        return 'Loading...';
    }
    return isOnline ? 'Online' : 'Offline';
}

function FriendListItem(props){
    const isOnline = useFriendStatus(props.friend.id);
    
    return (
        <li style={{color: isOnline ? 'green' : 'black'}}>
        	{props.friend.name}
        </li>
    )
}
```



React在执行的时候会按照hook出现的顺序依次执行，例如`useState`，React根据顺序取出state并赋值给对应的变量。

```
function Form(){
    const [name, setName] = useState('Mary');
   	useEffect(function persistForm(){
        localStorage.setItem('formData', name);
   	})
   	const [surname, setSurname] = useState('Poppings');
   	useEffect(function updateTitle(){
        document.title = name + ' ' + surname;
   	})
}

// 第一次渲染
// ------------
useState('Mary')           // 1. 初始化一个state变量，并赋值为‘Mary’
useEffect(persistForm)     // 2. 添加一个副作用
useState('Poppins')        // 3. 初始化一个state变量，并赋值为‘Poppins’
useEffect(updateTitle)     // 4. 添加一个副作用

// -------------
// 第二次渲染：第二次hook的执行会按照第一次的顺序去取出相关state或者替换effect
// -------------
useState('Mary')           // 1. 根据第一次hook的顺序，首先取出一个state给对应的变量
useEffect(persistForm)     // 2. 第二个hook是一个effect，所以这一次是替换上一次执行的effect
useState('Poppins')        // 3. 第三个hook又是一个state，再取出赋值给对应变量
useEffect(updateTitle)     // 4. 第四个还是一个effect，替换上一次effect

// ...
```



剩下还有其他hook，可以参考[这里](https://reactjs.org/docs/hooks-reference.html)



