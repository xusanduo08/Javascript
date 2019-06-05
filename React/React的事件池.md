#### Event Pooling

React里的事件不是原生的事件，而是经过React处理之后的合成事件--SyntheticEvent。这个合成事件对象会被放在事件池中缓存起来，反复使用。当事件回调函数运行结束后，出于性能原因刚才的事件数据会被清空，合成事件对象的属性值会被置为null，然后等待下次使用。也因此，在React中我们无法以异步的方式去获取一个事件对象及其上面的数据。

（官网有很好的例子，点击[这里](<https://reactjs.org/docs/events.html#event-pooling>)）

假设我们有个输入框，需要响应`change`事件，为了性能要求，加上防抖处理：

```jsx
class App extends React.Component{
    debounce(fn, delay){
        let timer = null;
        
        return function (arg){
            let that = this;
            clearTimeout(timer);
            timer = setTimeout(()=> {
                fn.call(that, arg);
            })
        }
    }
    
    handleChange(e){
        console.log(e.target) // null
    }
    
    render(){
        return (
        	<input onChange={this.debounce(this.handleChange, 100).bind(this)} />
        )
    }
}
```

上面对事件进行了防抖处理，每次会延迟100ms再执行事件处理函数。理论上这段代码没什么问题，但是因为事件池不能异步访问的原因，这段代码打不到预期效果，真正在`handleChange()`方法中访问到的事件对象上各个属性都是null.

__如果想异步访问事件对象，可以调用事件对象的`persist()`方法，该方法能将合成事件从事件池中移出并允许对事件的引用一直保存至使用__

修改下防抖函数：

```javascript
debounce(fn, delay){
    let timer = null;
    return function (arg){
        let that = this;
        clearTimeout(timer);
        arg.persist();
        timer = setTimeout(()=>{
            fn.call(that, arg)
        })
    }
}
```

经过上面的修改后，代码中就能访问到事件对象上的属性了。