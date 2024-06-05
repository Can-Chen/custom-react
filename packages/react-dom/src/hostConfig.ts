import { FiberNode } from "react-reconciler/src/fiber";
import { HostText } from "react-reconciler/src/workTags";
import { Props } from "shared/ReactTypes";
import { DOMElement, updateFiberProps } from "./SyntheticEvent";

export type Container = Element;
export type Instance = Container;
export type TextInstance = Text;

export const createInstance = (type: string, props: Props): Instance => {
  // TODO 处理props
  const element = document.createElement(type) as unknown;
  updateFiberProps(element as DOMElement, props);
  return element as DOMElement;
};

export const appendInitialChild = (
  parent: Instance | Container,
  child: Instance
) => {
  parent.appendChild(child);
};

export const createTextInstance = (content: string) => {
  return document.createTextNode(content);
};

export const commitUpdate = (fiber: FiberNode) => {
  switch (fiber.tag) {
    case HostText:
      const text = fiber.memoizedProps.content;
      return commitTextUpdate(fiber.stateNode, text);
    default:
      // @ts-ignore
      if (__DEV__) {
        console.warn("未实现的update类型", fiber);
      }
      break;
  }
};

export const commitTextUpdate = (
  textInstance: TextInstance,
  content: string
) => {
  textInstance.textContent = content;
};

export const removeChild = (
  child: Instance | TextInstance,
  container: Container
) => {
  container.removeChild(child);
};

export const appendChildToContainer = appendInitialChild;
