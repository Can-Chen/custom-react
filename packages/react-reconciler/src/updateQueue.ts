import { Dispatch } from "react/src/currentDispatcher";
import type { Action } from "shared/ReactTypes";
import { Lane, NoLane, isSubsetOfLanes } from "./fiberLanes";

export interface Update<State> {
  action: Action<State>;
  lane: Lane;
  next: Update<any> | null;
}

export interface UpdateQueue<State> {
  shared: {
    pending: Update<State> | null;
  };
  dispatch: Dispatch<State> | null;
}

// setState支持传数据或函数
export const createUpdate = <State>(
  action: Action<State>,
  lane: Lane
): Update<State> => {
  return {
    action,
    lane,
    next: null,
  };
};

export const createUpdateQueue = <State>() => {
  return {
    shared: {
      pending: null,
    },
    dispatch: null,
  } as UpdateQueue<State>;
};

export const enqueueUpdate = <State>(
  updateQueue: UpdateQueue<State>,
  update: Update<State>
) => {
  const pending = updateQueue.shared.pending;
  if (pending === null) {
    update.next = update;
  } else {
    update.next = pending.next;
    pending.next = update;
  }
  updateQueue.shared.pending = update;
};

export const processUpdateQueue = <State>(
  baseState: State,
  pendingUpdate: Update<State> | null,
  renderLane: Lane
): {
  memoizedState: State;
  baseState: State;
  baseQueue: Update<State> | null;
} => {
  const result: ReturnType<typeof processUpdateQueue<State>> = {
    memoizedState: baseState,
    baseQueue: null,
    baseState,
  };
  if (pendingUpdate !== null) {
    const first = pendingUpdate.next;
    let pending = pendingUpdate.next as Update<any>;

    let newBaseState = baseState;
    let newBaseQueueFirst: Update<State> | null = null;
    let newBaseQueueLast: Update<State> | null = null;
    let newState = baseState;

    do {
      const updateLane = pending.lane;
      if (!isSubsetOfLanes(renderLane, updateLane)) {
        // 优先级不够 被跳过的
        const clone = createUpdate(pending.action, pending.lane);
        // 是不是第一个被跳过的
        if (newBaseQueueFirst === null) {
          newBaseQueueFirst = clone;
          newBaseQueueLast = clone;
          newBaseState = newState;
        } else {
          (newBaseQueueLast as Update<State>).next = clone;
          newBaseQueueLast = clone;
        }
      } else {
        // 优先级足够
        if (newBaseQueueLast !== null) {
          const clone = createUpdate(pending.action, NoLane);
          newBaseQueueLast.next = clone;
          newBaseQueueLast = clone;
        }
        const action = pending.action;
        if (action instanceof Function) {
          // baseState 1 update (x) => 4x -> memoizedState 4
          newState = action(baseState);
        } else {
          // baseState 1 update 2 -> memoizedState 2
          newState = action;
        }
      }
      pending = pending.next as Update<any>;
    } while (pending !== first);

    if (newBaseQueueLast === null) {
      newBaseState = newState;
    } else {
      newBaseQueueLast.next = newBaseQueueFirst;
    }
    result.memoizedState = newState;
    result.baseState = newBaseState;
    result.baseQueue = newBaseQueueLast;
  }
  return result;
};
