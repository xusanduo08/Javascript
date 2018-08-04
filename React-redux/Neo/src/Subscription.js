
//订阅实例，用来订阅store，并管理组件的订阅

export default class Subscription {
  constructor(store, onStateChange) {
    this.unsubscribe = null; // null代表没有订阅
    this.store = store;
    this.onStateChange = onStateChange;
  }

  //订阅
  trySubscribe() {
    if (!this.unsubscribe) {
      this.unsubscribe = this.store.subscribe(this.onStateChange); //订阅后获获得一个取消订阅的函数
    }
  }

  //取消订阅
  tryUnsubscribe() {
    if (this.unsubscribe) {
      this.unsubscribe(); // 取消订阅
    }
  }

}