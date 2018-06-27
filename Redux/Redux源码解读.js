
//state的改变、props的改变都会引起组件的重新渲染。（shouldComponentUpdat=true）

/*
Redux:  createStore：创建并返回一个store
        combineReducers: reducer合成。当发起一个Action时，该函数会根据相应的key值，将state数据传入到对应的子reducer中
        applymiddleware：返回一个函数，该函数先执行每个中间件到第一个return返回（即返回以next为入参的那一层），
                        然后将返回的函数一层层嵌套执行并返回最终结果，获得带有中间件功能的dispatch

*/

/*
    一个Redux应用只有一个单一的store
    store通过Provider组件放在上下文中，子组件通过上下文获取store，这个子组件都是通过connect包装后生成的。
*/
import { storeShape, subscriptionShape } from "../utils/PropTypes";

const subscriptionKey = `${storeKey}Subscription`//storeSubscription
class Provider extends Component {
    getChildContext() {
        return {
            store: this.store,
            storeSubscription: null     //这地方会在子组件中用到
        }
    }
    constructor(props, context) {
        super(props, context);
        this.store = props.store;
    }

    render() {
        return Children.only(this.props.children)
    }
}

Provider.propTypes = {
    store: storeShape.isRequired,
    children: PropTypes.element.isRequired
}

Provider.childContextTypes = {
    store: storeShape.isRequired,
    storeSubscription: subscriptionShape
}

/*
    connect()用来把组件包装成一个新的、连接到store上的组件
*/

connect: return createConnect()
createConnect: return connect: return ConnectHOC(/*...args*/)
ConnectHOC = connectAdvanced
connectAdvanced: return wrapWithConnect(WrappedComponent)

function connectAdvanced(
    selectorFactory,
    {
        getDisplayName = name => `ConnectAdvanced(${name})`,
        methodName = 'connectAdvanced',
        renderCountProp = undefined,
        shouldHandleStateChanges = true,
        storeKey = 'store',
        withRef = false,
        ...connectOptions
    } = {}
) {
    return function wrapWithConnect(WrappedComponent) {
        class Connect extends Component {
      //......  
      return hoistStatics(Connect, WrappedComponent)
    }
}


class Connect extends Component {  //实际最终返回的是connect组件
    constructor(props, context) {
        super(props, context)

        this.version = version
        this.state = {}
        this.renderCount = 0
        this.store = props[storeKey] || context[storeKey]
        this.propsMode = Boolean(props[storeKey])//一般情况下，对于Provider下的组件，这个表达式的返回值肯定是false了
        this.setWrappedInstance = this.setWrappedInstance.bind(this)

        invariant(this.store,
            `Could not find "${storeKey}" in either the context or props of ` +
            `"${displayName}". Either wrap the root component in a <Provider>, ` +
            `or explicitly pass "${storeKey}" as a prop to "${displayName}".`
        )

        this.initSelector()
        this.initSubscription()
    }

    getChildContext() {
        // If this component received store from props, its subscription should be transparent
        // to any descendants receiving store+subscription from context; it passes along
        // subscription passed to it. Otherwise, it shadows the parent subscription, which allows
        // Connect to control ordering of notifications to flow top-down.
        //如果是从props获取到的store，则它的订阅对于通过context获取store的子组件都应该是透明的，就是说它的订阅实例子组件看不到
        const subscription = this.propsMode ? null : this.subscription
        //如果该组件订阅实例是透明的，则将其父组件的订阅实例放到上下文中，否则将该组件的订阅实例放到上下文中
        return { [subscriptionKey]: subscription || this.context[subscriptionKey] }
    }

    componentDidMount() {
        this.subscription.trySubscribe();
        //在这地方订阅store的变化，在trySubscriber()函数里会判断store的来源，如果来自父组件，则该组件的订阅函数会放到父组件的订阅队列里
        //也就是父组件订阅类的next和current数组里。
        //理解下来，应该只有最顶级的父元素是直接订阅store的，其它子组件都是通过嵌套，把各自的订阅函数放到了对应父级的listeners队列里，通过一层层
        //的嵌套，最终到了最顶级的父组件的listeners队列里
        //针对Provider下第一级子组件，由于parentSub为null，所以在订阅store的时候会直接通过this.store.subscribe()订阅
    }

    componentWillReceiveProps(nextProps) {
        this.selector.run(nextProps)
    }

    shouldComponentUpdate() {
        return this.selector.shouldComponentUpdate
    }

    componentWillUnmount() {
        if (this.subscription) this.subscription.tryUnsubscribe()  //注销对store的订阅
        this.subscription = null
        this.notifyNestedSubs = noop
        this.store = null
        this.selector.run = noop
        this.selector.shouldComponentUpdate = false
    }

    getWrappedInstance() {
        invariant(withRef,
            `To access the wrapped instance, you need to specify ` +
            `{ withRef: true } in the options argument of the ${methodName}() call.`
        )
        return this.wrappedInstance
    }

    setWrappedInstance(ref) {
        this.wrappedInstance = ref
    }
    /*
    selectorFactory:
        selectorFactory==>connectAdvanced(selectoryFactory, ...)作为入参传进来的，也就是在connect的里面返回的connectHOC(selectorFactory, ...)里的selectorFactory==>
        connect里面的selectoryFactory来自defaultSelectorFactory也就是selectoryFactory.js这个文件
        selectorFactory.js这个文件返回一个函数，如下，
        export default function finalPropsSelectorFactory(dispatch, {...}) {
            ...
            const selectorFactory = options.pure
                ? pureFinalPropsSelectorFactory
                : impureFinalPropsSelectorFactory
            return selectorFactory(
                mapStateToProps,
                mapDispatchToProps,
                mergeProps,
                dispatch,
                options
            )
        }
        也就是说，selectorFactory(this.store.dispatch, selectorFactoryOptions)这行代码其实就是selectorFactory(mapStateToProps,mapDispatchToProps,mergeProps,dispatch,options)，
        其返回的结果就赋值给了sourceSelector。
        我们来看下selectorFactory的返回值：默认情况下selectorFactory指向的是pureFinalPropsSelectorFactory这个函数（先看默认情况），
        也就是说，sourceSelector其实就是pureFinalPropsSelectorFactory函数执行后的返回值==>purFinalPropsSelector依然返回一个函数pureFinalPropsSelector，
        function pureFinalPropsSelector(nextState, nextOwnProps) {
            return hasRunAtLeastOnce
                ? handleSubsequentCalls(nextState, nextOwnProps)
                : handleFirstCall(nextState, nextOwnProps)
        }
        函数两个入参。所以，默认情况下，sourceSelector指向的就是上面这个函数，接收state和props作为入参。
    */
    initSelector() {
        const sourceSelector = selectorFactory(this.store.dispatch, selectorFactoryOptions)
        this.selector = makeSelectorStateful(sourceSelector, this.store)    //selector用来根据当前的state和props计算下一个props
        /*
        来看下makeSelectorStateful干了什么（这里只看做了什么，先不看为什么这样做，因为我暂时也不知道为什么这样做）：返回一个对象，这个对象具有一个run方法，
        run方法里面我们只看sourceSelector(store.getState(), props)，所以这个时候就要返回selectorFactory里面看下sourceSelector是个什么。
        经过上面的分析，sourceSelector默认情况下执行结果为handleSubsequentCalls(nextState, nextOwnProps)==>所以就要去看handleSubsequentCalls这个函数是做什么的

        handleSubsequentCalls：(nextState, nextOwnProps) => {
                const propsChanged = !areOwnPropsEqual(nextOwnProps, ownProps) //判断props是否变化
                const stateChanged = !areStatesEqual(nextState, state) //判断state是否变化
                state = nextState       
                ownProps = nextOwnProps

                if (propsChanged && stateChanged) return handleNewPropsAndNewState()
                if (propsChanged) return handleNewProps()
                if (stateChanged) return handleNewState()
                return mergedProps
            }
        */
        this.selector.run(this.props) //sourceSelector(this.store.getState(), props) => handleSubsequentCalls(nextState, nextOwnProps)
    }

    initSubscription() {
        if (!shouldHandleStateChanges) return

        // parentSub's source should match where store came from: props vs. context. A component
        // connected to the store via props shouldn't use subscription from context, or vice versa.
        //返回this.context.storeSubscription，针对Provider第一级子组件得到的值肯定是null，因为Provider没有订阅实例，其放在上下文中的storeSubscription就是null
        //非第一级的子组件，parentSub得到的就是上一级父组件的subscription实例
        const parentSub = (this.propsMode ? this.props : this.context)[subscriptionKey]

        this.subscription = new Subscription(this.store, parentSub, this.onStateChange.bind(this)) //返回一个订阅类，里面包含了订阅store的逻辑

        /*
            每一个组件都会有这样一个订阅类，这个订阅类里有个current和next队列，用来保存着这个组件下子组件的订阅函数，这样可以保证父组件总是在子组件刷新前刷新。
        */

        // `notifyNestedSubs` is duplicated to handle the case where the component is  unmounted in
        // the middle of the notification loop, where `this.subscription` will then be null. An
        // extra null check every change can be avoided by copying the method onto `this` and then
        // replacing it with a no-op on unmount. This can probably be avoided if Subscription's
        // listeners logic is changed to not call listeners that have been unsubscribed in the
        // middle of the notification loop.
        this.notifyNestedSubs = this.subscription.notifyNestedSubs.bind(this.subscription) //通知其他监听者的函数
    }

    onStateChange() {  //有状态变化时就会调用这个函数
        this.selector.run(this.props)

        if (!this.selector.shouldComponentUpdate) { 
            //如果不更新，那么通知子代监听者，这是为什么？难道是基于祖先组件也许不用更新，但是子代组件需要更新这个逻辑？
            //如果上面的逻辑成立，那这地方至少也得有个判断子代是否需要更新的逻辑吧

            //解释：判断组件是否需要更新是在组件内部进行判断的，所以这地方即使父组件不需要更新，
            //仍需要通知子组件state有变化，然后子组件内部会自己判断是否需要更新。
            //由这地方我们可以推测出，每个connect组件都会对state的变化进行响应，每个组件内部会比较state变化前后props的是否有变化（通过state计算出新的props）来决定是否重新渲染自己。
            this.notifyNestedSubs() //通知其他监听者，也就是调用所有的监听函数
        } else {
            this.componentDidUpdate = this.notifyNestedSubsOnComponentDidUpdate  //组件更新完之后就会调用这个函数，这个函数用来通知子代的订阅函数运行
            this.setState(dummyState)//dummyState是个空对象，这地方为什么要设置state为一个空对象=》我猜测这地方只是为了引起组件重新render的动作
        }
    }

    notifyNestedSubsOnComponentDidUpdate() {
        // `componentDidUpdate` is conditionally implemented when `onStateChange` determines it
        // needs to notify nested subs. Once called, it unimplements itself until further state
        // changes occur. Doing it this way vs having a permanent `componentDidUpdate` that does
        // a boolean check every time avoids an extra method call most of the time, resulting
        // in some perf boost.（这地方不太明白，即使componentDidUpdate是一直存在的，也只有这个组件更新完后才调用，这种情况也不是一种多余的调用啊？？）
        //当onStateChange内部判断需要通知子订阅实例的时候componentDidUpdate就会被赋值。componentDidUpdate一旦被执行，其
        //就会将自己置为undefined，直到下一次state change发生。这样的做法与一直拥有一个已经实现的componentDidUpdate相比，前者每次
        //都会进行一次判断，避免不必要的函数调用，提升一些性能
        //找到一个类似的issue，https://github.com/reduxjs/react-redux/issues/739
        //按照这个issue的理解，这地方是为了防止这样一种情况：父组件是没有被connect包括的组件，然后子组件是被connect包裹的组件，当父组件re-render后，
        //会直接引起子组件的re-render，因为父组件没有被connect处理，所以这地方不会通过调用子组件的onStateChange方式来通知子组件re-render，那么这种情况下，如果
        //子组件的componentDidUpdate一直是存在的，那么这时候子组件re-render后就会去通知下一层的子组件，这个时候才会通过调用下一层子组件的onStateChange方法通知
        //组件是否渲染。而事实上，没有被connect处理的父组件re-render后子组件根本不需要re-render（父组件都没有绑定到store，它的变更肯定不是因为store有变化。）
        //，上面提到的这种情况，由于componentDidUpdate一直存在，所以第一层子组件更新完后，按照声明周期调用了componentDidUpdate，
        //通知了下一层子组件，这地方，是没有必要的，而按照现在componentDidUpdate实现的方式，这种情况是可以避免的。



        /////////////////////说的不对，子组件渲不渲染在内部由shouldComponentUpdate控制着，父组件渲染了，子组件未必渲染。想不通了
        this.componentDidUpdate = undefined
        this.notifyNestedSubs()
    }

    isSubscribed() {
        return Boolean(this.subscription) && this.subscription.isSubscribed()
    }

    addExtraProps(props) {
        if (!withRef && !renderCountProp && !(this.propsMode && this.subscription)) return props
        // make a shallow copy so that fields added don't leak to the original selector.
        // this is especially important for 'ref' since that's a reference back to the component
        // instance. a singleton memoized selector would then be holding a reference to the
        // instance, preventing the instance from being garbage collected, and that would be bad
        const withExtras = { ...props }
        if (withRef) withExtras.ref = this.setWrappedInstance
        if (renderCountProp) withExtras[renderCountProp] = this.renderCount++
        if (this.propsMode && this.subscription) withExtras[subscriptionKey] = this.subscription
        return withExtras
    }

    render() {
        const selector = this.selector
        selector.shouldComponentUpdate = false

        if (selector.error) {
            throw selector.error
        } else {
            return createElement(WrappedComponent, this.addExtraProps(selector.props))
        }
    }
}

props是只读属性，无法在组件内自己修改自己的props，如果想修改props，应该修改props的来源

mapStateToProps(state, ownProps)这里面的ownProps指的是connect()(component)返回的容器组件（container）的props，而不是展示组件（component）的props

connect的作用就是从context中获取到store，然后有选择性的（mapStateToProps,mapDispatchToProps）将state中的值通过props传给其包含的子组件。

combineReducers的作用：取出state中的部分数据，交给指定的reducer处理（分发全部state的属性到各个reducer中去）
combineReducers{
    key1: reducer1,
    key2: reducers
}
实际在运行的时候是：reducer1(state[key1], action), reducer2(state[key2])。这样做的好处是，避免每次都向reducer中传入一整个state，使得reduce易于管理和书写r。
因为web应用的
state会随着需求的增加而变的非常复杂，我们每次修改state肯定也只是修改state中的部分数据，假如我需要修改的只是state.one.a，
那么这时候传入一整个state，在处理的时候还首先要一层层去找这个属性，要判断它的父级属性state.a是否存在，然后在判断state.b是否存在，都存在了，再进行修改，这使得程序很复杂,
同时，引入传入的是一整个state，如果一不小心修改了state中其他部分的数据，还会导致额外的问题。假如我们传入state.one就可以少很多代码，
像这样reducer(state.one, action)，这样修改也只是修改state.one下面的数据，其他数据我不碰，避免不必要的问题出现。
这样使得每个reducer只关心自己的那部分数据，在编写代码的时候相对也会简单很多。还有个比较重要的一个点，reducer是个纯函数，运行的时候会对传入的state进行深拷贝，很明显，传入一整个state
对性能的影响要比传入部分state大。

sourceSelector(store.getState(), this.props) => pureFinalPropsSelector(nextState, nextOwnProps) => handleSubSequenCalls(nextState, nextOwnProps)
    ||                                                                                                                ||
    ||                                                                                                                ||
    ||                                                                                                               \||/
    ||                                                                                                            handleNewState(){
    ||                                                                                                               state = nextState;
    ||                                                                                                                ownProps = nextOwnProps
store改变，开始运行订阅函数                                                                                           stateProps = mapStateToProps(state, ownProps)
    ||计算出下一个state                                                                                              mergedProps = mergeProps(stateProps, dispatchProps, ownProps)
reducer
    ||                                                                                                              return mergedProps
dispatch(action)                                                                                                }



dispatch(action) <= dispatch(actionCreator(...args))
bindActionCreator => (actionCreator, dispatch) {
    return (...args) => dispatch(actionCreator(...args))
}