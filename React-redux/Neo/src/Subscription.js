
const CLEARED = null
const nullListeners = { notify() {} }

function createListener() {
  let current = []
  let next = []

  return {
    clear() {
      next = CLEARED
      current = CLEARED
    },

    notify() {
      const listeners = current = next
      for (let i = 0; i < listeners.length; i++) {
        listeners[i]()
      }
    },

    get() {
      return next
    },

    subscribe(listener) {
      let isSubscribed = true
      if (next === current) next = current.slice()
      next.push(listener)

      return function unsubscribe() {
        if (!isSubscribed || current === CLEARED) return
        isSubscribed = false

        if (next === current) next = current.slice()
        next.splice(next.indexOf(listener), 1)
      }
    }
  }
}

//订阅实例，用来订阅store，并管理组件的订阅
export default class Subscription {
  constructor(store, parentSub, onStateChange) {
    this.unsubscribe = null; // null代表没有订阅
    this.store = store;
    this.onStateChange = onStateChange;
    this.listener = nullListeners;
    this.parentSub = parentSub;
  }

  addNestedSub(listener){
    this.trySubscribe();
    return this.listener.subscribe(listener);
  }

  notifyNestedSubs(){
    this.listener.notify()
  }

  isSubscribed() {
    return Boolean(this.unsubscribe);
  }

  //订阅
  trySubscribe() {
    if (!this.unsubscribe) {
      this.unsubscribe = this.parentSub ? 
        this.parentSub.addNestedSub(this.onStateChange) : this.store.subscribe(this.onStateChange); //订阅后获获得一个取消订阅的函数
      this.listener = createListener()
    }
  }

  //取消订阅
  tryUnsubscribe() {
    if (this.unsubscribe) {
      this.unsubscribe(); // 取消订阅
      this.unsubscribe = null;
      this.listener.clear();
      this.listener = nullListeners;
    }
  }

}