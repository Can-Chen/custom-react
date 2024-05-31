import type { Props, Key, Ref } from "shared/ReactTypes";
import type { WorkTag } from "./workTags";
import type { Flags } from "./fiberFlags";
import { NoFlags } from "./fiberFlags";

export class FiberNode {
  type: any;
  tag: WorkTag;
  pendingProps: Props;
  key: Key;
  stateNode: any;
  ref: Ref;

  return: FiberNode | null;
  sibling: FiberNode | null;
  child: FiberNode | null;
  index: number;

  memoizedProps: Props | null;

  alternate: FiberNode | null;
  flags: Flags;

  constructor(tag: WorkTag, pendingProps: Props, key: Key) {
    // 实例
    this.tag = tag;
    this.key = key;
    // HostCompoent <div> div DOM
    this.stateNode = null;
    // FunctionComponent () => {}
    this.type = null;

    // 构成树状结构
    this.return = null;
    this.sibling = null;
    this.child = null;
    this.index = 0;

    this.ref = null;

    // 作为工作单元
    this.pendingProps = pendingProps;
    this.memoizedProps = null;

    this.alternate = null;
    // 副作用
    this.flags = NoFlags;
  }
}
