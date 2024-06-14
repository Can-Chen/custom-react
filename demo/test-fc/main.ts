import {
  unstable_ImmediatePriority as ImmediatePriority,
  unstable_UserBlockingPriority as UserBlockingPriority,
  unstable_NormalPriority as NormalPriority,
  unstable_LowPriority as LowPriority,
  unstable_IdlePriority as IdlePriority,
  unstable_scheduleCallback as scheduleCallback,
  unstable_shouldYield as shouldYield,
  CallbackNode,
  unstable_getFirstCallbackNode as getFirstCallbackNode,
  unstable_cancelCallback as cancelCallback,
} from "scheduler";

/**
 * 测试btn
 */
import "./style.css";
const button = document.querySelector("button");
const root = document.querySelector("#root");

[LowPriority, NormalPriority, UserBlockingPriority, ImmediatePriority].forEach(
  (priority) => {
    const btn = document.createElement("button");
    root?.appendChild(btn);
    btn.innerText = [
      "",
      "ImmediatePriority",
      "UserBlockingPriority",
      "NormalPriority",
      "LowPriority",
    ][priority];
    btn.style.display = "block";
    btn.onclick = () => {
      workList.unshift(
        // 任务进度
        // 要保证任务类型是可中断并恢复的
        {
          count: 100,
          priority: priority as Priority,
        }
      );
      schedule();
    };
  }
);

type Priority =
  | typeof IdlePriority
  | typeof LowPriority
  | typeof NormalPriority
  | typeof UserBlockingPriority
  | typeof ImmediatePriority;

interface Work {
  count: number;
  priority: Priority;
}

const workList: Work[] = [];
let prevPriority: Priority = IdlePriority;
let curCallback: CallbackNode | null = null;

function schedule() {
  const cbNode = getFirstCallbackNode();
  // 给任务优先级排序
  const curWork = workList.sort((w1, w2) => w1.priority - w2.priority)[0];

  if (!curWork) {
    curCallback = null;
    cbNode && cancelCallback(cbNode);
    return;
  }

  const { priority: curPriority } = curWork;
  // 当前运行的优先级一致
  if (curPriority === prevPriority) return;

  cbNode && cancelCallback(cbNode);

  curCallback = scheduleCallback(curPriority, perform.bind(null, curWork));
}

function perform(work: Work, didTimeout?: boolean) {
  /**
   * 1. work.priority
   * 2. 饥饿问题
   * 3. 时间切片
   */
  const needSync = work.priority === ImmediatePriority || didTimeout;
  while ((needSync || !shouldYield()) && work.count) {
    // 任务进度
    work.count--;
    // 执行的任务
    insertSpan(work.priority + "");
  }

  // 中断执行 ｜｜ 执行完
  prevPriority = work.priority;

  // 执行完
  if (!work.count) {
    const workIndex = workList.indexOf(work);
    workList.splice(workIndex, 1);
    prevPriority = IdlePriority;
  }

  const prevCallback = curCallback;
  schedule();
  const newCallback = curCallback;

  if (newCallback && prevCallback === newCallback) {
    return perform.bind(null, work);
  }
}

function insertSpan(content) {
  const span = document.createElement("span");
  span.innerText = content;
  span.className = `pri-${content}`;
  doSomeBusyWork(5);
  root?.appendChild(span);
}

function doSomeBusyWork(len: number) {
  let now = Date.now() + len;
  while (now - Date.now() > 0) {}
}
