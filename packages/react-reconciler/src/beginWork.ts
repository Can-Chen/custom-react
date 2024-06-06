// 递阶段

import { ReactElementType } from "shared/ReactTypes";
import { FiberNode } from "./fiber";
import { UpdateQueue, processUpdateQueue } from "./updateQueue";
import {
  Fragment,
  FunctionComponent,
  HostComponent,
  HostRoot,
  HostText,
} from "./workTags";
import { mountChildFibers, reconcilerChildFibers } from "./childFibers";
import { renderWithHooks } from "./fiberHooks";
import { Lane } from "./fiberLine";

export const beginWork = (wip: FiberNode, renderLane: Lane) => {
  //比较 返回子fiberNode
  switch (wip.tag) {
    case HostRoot:
      return updateHostRoot(wip, renderLane);
    case HostComponent:
      return updateHostcomponent(wip);
    case HostText:
      return null;
    case FunctionComponent:
      return updateFunctionComponent(wip, renderLane);
    case Fragment:
      return updateFragment(wip);
    default:
      // @ts-ignore
      if (__DEV__) {
        console.warn("begin未实现的类型");
      }
      break;
  }
  return null;
};

function updateHostRoot(wip: FiberNode, renderLane: Lane) {
  const baseState = wip.memoizedState;
  const updateQueue = wip.updateQueue as UpdateQueue<Element>;
  const pending = updateQueue.shared.pending;
  updateQueue.shared.pending = null;
  const { memoizedState } = processUpdateQueue(baseState, pending, renderLane);
  wip.memoizedState = memoizedState;

  const nextChildren = wip.memoizedState;
  reconcilerChildren(wip, nextChildren);
  return wip.child;
}

function updateFunctionComponent(wip: FiberNode, renderLane: Lane) {
  const nextChildren = renderWithHooks(wip, renderLane);
  reconcilerChildren(wip, nextChildren);
  return wip.child;
}

function updateFragment(wip: FiberNode) {
  const nextChildren = wip.pendingProps;
  reconcilerChildren(wip, nextChildren);
  return wip.child;
}

function updateHostcomponent(wip: FiberNode) {
  const nextProps = wip.pendingProps;
  const nextChildren = nextProps.children;
  reconcilerChildren(wip, nextChildren);
  return wip.child;
}

function reconcilerChildren(wip: FiberNode, children?: ReactElementType) {
  const current = wip.alternate;
  if (current !== null) {
    // update
    wip.child = reconcilerChildFibers(wip, current?.child, children);
  } else {
    // mount
    wip.child = mountChildFibers(wip, null, children);
  }
}
