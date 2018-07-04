### Growth/Update

​	当组件挂载完毕后，接下来就会进入成长（growth）或者叫更新（update）阶段。在这一阶段，我们通常会更新数据，根据用户或者系统的动作做相应的反应，以便让使用者体验我们的应用。

​	有三种方式可以组件进入更新阶段：改变`props`、改变`state`或者调用组件的`forceUpdate()`方法。通过对以上三种方法的调用，组件都会进入更新阶段，并且我们所做的改变都会在更新阶段有所体现。

#### 第一种方法：Changeing Props

​	当传入组件的props发生改变时，组件更新过程会被触发。

​	从组件的角度来看，props是不可修改的，换句话说，组件没法修改自己的props。对组件而言，props在其内部是只读的。

```javascript
 render(){
 	setTimeout(() => {
     	this.props.name = 2000
     }, 2000)
 	return this.props.children
 }
 //Uncaught TypeError: Cannot add property name, object is not extensible
//或者提示：TypeError: Cannot assign to read only property 'name' of object '#<Object>'
```

​	组件是没法在内部修改自己的props的，只有通过父组件修改然后传递给子组件。当新的props通过父组件或者根组件传递过来后，更新阶段就开始了。

#### 第二种方法：`setState()`

​	state本来就是属于组件内部的状态，组件可以修改自己的state。当state被修改时，就会触发更新过程。state的存在，至今在社区里依然是个有争议的话题。何时使用state？什么样的数据应当或者不应当存储到state中？是否该一直使用state？。。事到如今，这些仍然是大家讨论的话题。

​	但有一点要记住，明白state是如何工作的很重要。

​	__state具有异步性__。当开发者在第一次使用`setState()`时，一般都会以为方法调用后，state值就会立即改变。事实并不是这样，__`setState()`方法具有一定的异步性__。

​	一般情况下我们会通过`setState()`部分更改state的值，全部更新或者替换state值的情况很少见。React内部有个队列系统来管理者这些要发生的改变。因为在一个方法里，我们可能会多次修改state值，而这个队列就是用来管理这些改变的。__当队列里添加了一个改变state的动作时，React就会把组件放进脏队列里。这个脏队列跟踪着需要改变state并随后需要进入更新过程的组件__。

​	当使用state时，一定要记住上面说的__state具有异步性__。一个常见的错误就是，我们在方法里的某处调用了`setState()`，然后 紧接着就去想同步的去获取这个更新后的state值，这样通常会引起一些奇怪的bug。

### 第三种方法：`forceUpdate()`

​	这个方法会强制让组件进入更新过程，并且它还会其他生命周期方法的执行有些影响。