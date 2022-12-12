// 我们都知道，useState在组件mount和update时行为是不一样的
// 所以我们这里也要有个变量来区分此次渲染是mount还是update
let isMount = true;
let workInProgressHook = null; 


// 在react中组件都是用fiber来表示，所以这里我们也创建一个fiber对象
const fiber = {
  stateNode: App,
  memoizedState: null, // 指向hook链表的第一个指针 
}

function useState(initialState) {
  let hook;
  if (isMount) {
    hook = {
      memoizedState: initialState,
      next: null,
      queue: {
        pending: null, // 保存当前hook做的操作
      }
    }
    if (!fiber.memoizedState) {
      fiber.memoizedState = hook;
    } else {
      workInProgressHook.next = hook;
    }
    workInProgressHook = hook;
  } else {
    hook = workInProgressHook;
    workInProgressHook = workInProgressHook.next; 
  }

  let baseState = hook.memoizedState;
  // 便利待更新队列里的更新，计算最终状态
  if (hook.queue.pending !== null) {
    let firstUpdate = hook.queue.pending.next;
    do {
      const action = firstUpdate.action;
      baseState = action(baseState); 
      firstUpdate = firstUpdate.next;
    } while(firstUpdate !== hook.queue.pending.next)

    hook.queue.pending = null;
  }
  hook.memoizedState = baseState; // 将计算出来的最新的state记录到memoizedState上

  return [baseState, dispatchAction.bind(null, hook.queue)];
}

// 将操作更新到待更新队列（queue.pending）
function dispatchAction(queue, action) {
  const update = {
    action,
    next: null,
  }
  if (queue.pending === null) {
    update.next = update;
    queue.pending = update;
  } else {
    update.next = queue.pending.next;
    queue.pending.next = update;
  }
  queue.pending = update; // 指向链表的最后一个

  // 更新已经更新到待更新队列了，接下来就是重新渲染
  schedule();
}

// 我们知道，在react中，组件的更新都是按照一定规则去执行的，是否更新以及何时更新都由调度器来决定
// 所以我们这里也来创建一个调度器，模拟react的调度
function schedule() {
  workInProgressHook = fiber.memoizedState; // 每次更新肯定都是从第一个hook开始执行
  // 所以这里的更新就比较简单直接了
  const app = fiber.stateNode();
  isMount = false; 
  return app;
}



function App() {
  const [num, updateNum] = useState(0);
  const [num2, updateNum2] = useState(1);
  console.log('num is ', num);
  console.log('num2 is ', num2);
  return {
    onClick: () => {
      updateNum(num => num + 1);
      updateNum2(num => num + 2);
    },
    printNum:() => {
      console.log(num);
    }
  };
}
