### webpack是如何加载模块的（三）：react是如何实现路由级动态加载的

以下内容所使用的webpack版本是4.43。

react实现动态加载官方目前给出的方案有两种，一种是使用`import()`语法，配合loadable-component这个第三方库使用；一种是使用`React.lazy()`。`React.lazy()`目前不支持服务端渲染，如果想在服务端做动态加载只能使用`import()`+loadable-component方法。

实现动态加载首先要做的就代码分割，确定哪些代码需要动态加载。分割的一个标准就是要确保分割后的代码在动态加载时不能影响到用户体验。

**路由级动态加载**就是根据路由来进行代码分割。应用中的代码是按照路由进行分割的，路由不同的页面在打包时被会被打包到不同文件中，当访问某个具体路由时，当前路由对应的页面就会被动态加载进来。根据路由来进行代码分割的好处就是用户一般感知不到代码加载过程。因为用户一般习惯于在页面切换的间隙有一定的等待时间，如果在这个等待时间加载代码的话，那么代码加载对用户体验的影响会比较小。而且由于在切换页面时用户默认允许一个等待时间，在等待时也不会对元素进行操作，也就避免了一些异常情况的出现。

下面看下loadable-component实现路由级动态加载的逻辑。

通过前面两篇文章的讲解，我们知道，`import(chunkId)`语法在编译后实际变成了下面这个样子：

```javascript
__webpack_require_.e(chunkId).then(__webpack_require.bind(chunkPath))
```

`__webpack_require.e()`：动态加载代码

`__webpack_require.bind(chunkPath)`：运行模块代码，并返回模块导出的内容

以上这些将在下面讲解的时候用到。

App.js

```jsx
import React, { useState } from 'react';
import loadable from './loadable/component/src'
import {
  BrowserRouter as Router,
  Route,
  Link
} from "react-router-dom";

const Async = loadable(() => import('./Async'), {fallback: <div>loading...</div>});
function App() {
  const [showAsync, setShowAsync] = useState(false)
  
  return <Router>
    App
    <Link to='/async'>Async</Link>
    <Route path='/async'>
      <Async />
    </Route>
  </Router>
}

export default App;
```

Async.js

```jsx
import React from 'react';

function Async (){
  return <div>Async</div>
}

export default Async;
```

上面组件的业务很简单：当访问`/async`路由时先去**远程加载**`Async`组件代码然后再**渲染**。

`<Route />`路由组件的作用是当访问这个路由时再渲染对应的页面/组件，动态加载的功能并不是`<Route />`实现的。对于要动态加载的组件，需要通过`loadable()`方法处理下，`loadable()`其实是一个具有动态加载内部组件功能的HOC，为了方便后面的叙述，把经过loadable处理过的组件加个HOC-前缀。

```jsx
const HOCAsync = loadable(
  () => import('./Async'), 
  {fallback: <div>loading...</div>} // 加载时显示的loading状态
);
/*******************/
<Route path='/async'>
  <HOCAsync />
</Route>
```

当访问`/async`路由时，`HOCAsync`会先被渲染，其内部检测到真正的Async组件代码还没有加载的话就会先去加载，加载结束后再渲染。

接着来看下`loadable()`方法是如何实现动态加载的。

文章开头就说了，`import(chunkId)`在经过编译后变成下面的样子：

```javascript
__webpack_require_.e(chunkId).then(__webpack_require.bind(chunkPath))
```

那么`()=>import('./Async')`编译后的结果其实就是：

```javascript
()=> __webpack_require_.e(chunkId).then(__webpack_require.bind(chunkPath))
```

说白了就是一个返回模块导出内容的函数。

`loadable()`内部的实现逻辑其实也比较简单，在`componentDidMount()`中触发执行上面的代码加载逻辑：

```javascript
componentDidMount() {
  this.mounted = true

  if (this.state.loading) {
    this.loadAsync()
  } else if (!this.state.error) {
    this.triggerOnLoad()
  }
}
```

加载完毕就能获取到组件内容，然后渲染：

```javascript
loadAsync() {
  if (!this.promise) {
    const { __chunkExtractor, forwardedRef, ...props } = this.props
    // ctor.requireAsync就是() => import('./Async.js')方法
    this.promise = ctor
      .requireAsync(props) // 这地方为什么要传props:为了支持full dynamic imports
      .then(loadedModule => { // loadedModule就是模块导出的内容
      const result = resolve(loadedModule, { Loadable })
      if (options.suspense) {
        this.setCache(result)
      }
      this.safeSetState(
        {
          result: resolve(loadedModule, { Loadable }),
          loading: false,
        },
        () => this.triggerOnLoad(),
      )
    })
      .catch(error => {
      this.safeSetState({ error, loading: false })
    })
  }

  return this.promise
}
```

`loadAsync()`方法将获取到的模块内容放到`result`变量中，接下来在`render()`方法中渲染`result`：

```javascript
render() {
  
  //...
  // 在未成功加载前，先渲染传入进来的loading组件
  const fallback = propFallback || options.fallback || null
  if (loading) {
    return fallback
  }

  return render({
    loading,
    fallback,
    result,
    options,
    props: { ...props, ref: forwardedRef },
  })
}
```

`loadable()`方法对组件做了一定的性能优化。在使用时，可以传入cacheKey，用来作为组件是否发生改变的标志，如果没有传入cacaheKey，则默认使用`JSON.stringfy(props)`的返回值作为cacheKey，每次外层HOC更新完毕后会比较前后两次cacheKey是否发生改变，如有改变，则重新调用`this.loadAsync()`方法获取最新的组件内容然后再渲染：

```javascript
function getCacheKey(props) {
  if (options.cacheKey) {
    return options.cacheKey(props) // 计算缓存key
  }
  if (ctor.resolve) {
    return ctor.resolve(props)
  }
  return null
}

constructor(props) {
  super(props)

  this.state = {
    result: null,
    error: null,
    loading: true,
    cacheKey: getCacheKey(props), // 设置缓存key：cacheKey
  }
  // ....
}
componentDidUpdate(prevProps, prevState) {
  // 如果cacheKey有变化，则重新获取组件内容然后重新渲染
  if (prevState.cacheKey !== this.state.cacheKey) {
    this.promise = null
    this.loadAsync()
  }
}
```





