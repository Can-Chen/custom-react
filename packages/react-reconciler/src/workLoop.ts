import { beginWork } from "./beginWork";
import { commitMutationEffects } from "./commitWork";
import { completeWork } from "./completeWork";
import { FiberNode, FiberRootNode, createWorkInProgress } from "./fiber";
import { MutationMask, NoFlags } from "./fiberFlags";
import { HostRoot } from "./workTags";

let workInProgress: FiberNode | null = null;

function prepareFreshStack(root: FiberRootNode) {
  workInProgress = createWorkInProgress(root.current, {});
}

export function scheduleUpdateOnFiber(fiber: FiberNode) {
  // TODO 调度功能
  // 找到fiberRootNode
  const root = markUpdateFromFiberToRoot(fiber);
  renderRoot(root);
}

function markUpdateFromFiberToRoot(fiber: FiberNode) {
  let node = fiber;
  let parent = node.return;
  while (parent !== null) {
    node = parent;
    parent = node.return;
  }
  if (node.tag === HostRoot) {
    return node.stateNode;
  }
  return null;
}

function renderRoot(root: FiberRootNode) {
  // 初始化
  // 创建workInprogress
  prepareFreshStack(root);
  do {
    try {
      workLoop();
      break;
    } catch (e) {
      // @ts-ignore
      if (__DEV__) {
        console.warn("workLoop发生错误", e);
      }
      workInProgress = null;
    }
  } while (true);
  const finishedWork = root.current.alternate;
  root.finishedWork = finishedWork;
  // wip fiberNode树 树中的flags
  commitRoot(root);
}

function commitRoot(root: FiberRootNode) {
  const finishedWork = root.finishedWork;
  if (finishedWork === null) {
    return;
  }
  // @ts-ignore
  if (__DEV__) {
    console.warn("commit阶段开始", finishedWork);
  }
  // 重置
  root.finishedWork = null;

  // 判断是否存在3个子阶段需要执行的操作
  // root flags root subtreeFlags
  const subtreeHasEffect =
    (finishedWork.subtreeFlags && MutationMask) !== NoFlags;
  const rootHasEffect = (finishedWork.flags && MutationMask) !== NoFlags;

  if (subtreeHasEffect || rootHasEffect) {
    // before mutation
    // mutation placement
    commitMutationEffects(finishedWork);
    root.current = finishedWork;
  } else {
    root.current = finishedWork;
  }
}

function workLoop() {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}

function performUnitOfWork(fiber: FiberNode) {
  // beginwork 向下遍历
  /**
   * <App>
   *    <div>
   *       <span>最深</span>
   *       <span>兄弟</span>
   *    </div>
   *    <section>
   *       <a>测试</a>
   *       <a>
   *          测试2
   *          <a>测试3</a>
   *       </a>
   *    </section>
   * </App>
   */

  /**
   * begin: App  .child => div
   * begin: div  .child => span
   * begin: span .child => 最深
   * begin: 最深  .child => null
   * complete: 最深 .sibling => null => .return
   * complete: span .sibling => span
   * begin: span .child => 兄弟
   * beign: 兄弟  .child => null
   * complete: 兄弟 .sibling => null => .return
   * complete: span .sibling => null => .return
   * complete: div .sibling => section
   * begin: section .child => a
   * beign: a .child => 测试
   * begin: 测试 .child => null
   * complete: 测试 .sibling => null => .return
   * complete: a .sibling => a
   * begin: a .child => 测试2
   * begin: 测试2 .child => null
   * complete: 测试2 .sibling => a
   * begin: a .child => 测试3
   * begin: 测试3 .child => null
   * complete: 测试3 .sibling => null => .return
   * complete: a .sibling => null => .return
   * complete: section .sibling => null => .return
   * complete: App .sibling => null => .return
   */
  const next = beginWork(fiber);
  fiber.memoizedProps = fiber.pendingProps;

  // 向下遍历结束 开始向上遍历
  if (next === null) {
    completeUnitOfWork(fiber);
  } else {
    workInProgress = next;
  }
}

function completeUnitOfWork(fiber: FiberNode) {
  let node: FiberNode | null = fiber;

  /**
   * 先遍历当前节点
   * 如果当前节点
   */
  do {
    completeWork(node);
    const sibling = node.sibling;

    if (sibling !== null) {
      workInProgress = sibling;
      return;
    }
    node = node.return;
    workInProgress = node;
  } while (node !== null);
}
