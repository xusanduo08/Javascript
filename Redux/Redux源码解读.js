
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


class Connect extends Component {
    constructor(props, context) {
        super(props, context)

        this.version = version
        this.state = {}
        this.renderCount = 0
        this.store = props[storeKey] || context[storeKey]
        this.propsMode = Boolean(props[storeKey])//一般情况下，对于Provider下的第一级子组件，这个表达式的返回值肯定是false了
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
        //如果是从props获取到的store，则它的订阅对于通过context获取store的子组件都应该是透明的
        const subscription = this.propsMode ? null : this.subscription
        return { [subscriptionKey]: subscription || this.context[subscriptionKey] }
    }

    componentDidMount() {
        this.subscription.trySubscribe();//在这地方订阅store的变化，在trySubscriber()函数里会判断store的来源，如果来自父组件，则该组件的订阅函数会放到父组件的订阅队列里
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
        //针对Provider第一级子组件，返回this.context.storeSubscription，得到的值是null
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

        if (!this.selector.shouldComponentUpdate) { //如果不更新，那么通知子代监听者，这是为什么？难道是基于祖先组件也许不用更新，但是子代组件需要更新这个逻辑？
            //如果上面的逻辑成立，那这地方至少也得有个判断子代是否需要更新的逻辑吧
            this.notifyNestedSubs() //通知其他监听者，也就是调用所有的监听函数
        } else {
            this.componentDidUpdate = this.notifyNestedSubsOnComponentDidUpdate  //组件更新完之后就会调用这个函数，这个函数用来通知子代的订阅函数运行
            this.setState(dummyState)//dummyState是个空对象，这地方为什么要设置state为一个空对象，我猜测这地方只是为了引起组件重新render的动作
        }
    }

    notifyNestedSubsOnComponentDidUpdate() {
        // `componentDidUpdate` is conditionally implemented when `onStateChange` determines it
        // needs to notify nested subs. Once called, it unimplements itself until further state
        // changes occur. Doing it this way vs having a permanent `componentDidUpdate` that does
        // a boolean check every time avoids an extra method call most of the time, resulting
        // in some perf boost.
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