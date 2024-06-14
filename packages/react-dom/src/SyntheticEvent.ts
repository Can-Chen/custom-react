import { Container } from "hostConfig";
import {
  unstable_ImmediatePriority,
  unstable_NormalPriority,
  unstable_UserBlockingPriority,
  unstable_runWithPriority,
} from "scheduler";
import { Props } from "shared/ReactTypes";

export const elementPropsKey = "__props";
const validEventTypeList = ["click"];

type EventCallback = (e: Event) => void;

interface SyntheticEvent extends Event {
  __stopPropagation: boolean;
}

interface Paths {
  capture: EventCallback[];
  bubble: EventCallback[];
}

export interface DOMElement extends Element {
  [elementPropsKey]: Props;
}

export function updateFiberProps(node: DOMElement, props: Props) {
  node[elementPropsKey] = props;
}

export function initEvent(container: Container, eventType: string) {
  if (!validEventTypeList.includes(eventType)) {
    console.warn(`当前不支持${eventType}事件`);
    return;
  }
  // @ts-ignore
  if (__DEV__) {
    console.log(`初始化事件: ${eventType}`);
  }
  container.addEventListener(eventType, (e) => {
    dispatchEvent(container, eventType, e);
  });
}

function dispatchEvent(container: Container, eventType: string, e: Event) {
  const targetElement = e.target;

  if (targetElement === null) {
    console.warn(`事件不存在target`, e);
    return;
  }

  // 收集事件
  const { bubble, capture } = collectPaths(
    targetElement as DOMElement,
    container,
    eventType
  );
  // 构造合成事件
  const se = createSyntheticEvent(e);

  // 遍历capture
  triggerEventFlow(capture, se);

  if (!se.__stopPropagation) {
    // 遍历bubble
    triggerEventFlow(bubble, se);
  }
}

function collectPaths(
  targetElement: DOMElement,
  container: Container,
  eventType: string
) {
  const paths: Paths = {
    capture: [],
    bubble: [],
  };

  while (targetElement && targetElement !== container) {
    // 收集
    const elementProps = targetElement[elementPropsKey];
    if (elementProps) {
      // click -> onClick onClickCapture
      const callbackNameList = getEventCallbackNameFromEventType(eventType);
      if (callbackNameList) {
        callbackNameList.forEach((callbackName, i) => {
          const eventCallback = elementProps[callbackName];
          if (eventCallback) {
            if (i === 0) {
              paths.capture.unshift(eventCallback);
            } else {
              paths.bubble.push(eventCallback);
            }
          }
        });
      }
    }
    targetElement = targetElement.parentNode as DOMElement;
  }
  return paths;
}

function getEventCallbackNameFromEventType(
  eventType: string
): string[] | undefined {
  return {
    click: ["onClickCapture", "onClick"],
  }[eventType];
}

function createSyntheticEvent(e: Event) {
  const syntheticEvent = e as SyntheticEvent;
  syntheticEvent.__stopPropagation = false;
  const originStopPropagation = e.stopPropagation;

  syntheticEvent.stopPropagation = () => {
    syntheticEvent.__stopPropagation = true;
    if (originStopPropagation) {
      originStopPropagation();
    }
  };
  return syntheticEvent;
}

function triggerEventFlow(paths: EventCallback[], se: SyntheticEvent) {
  for (let index = 0; index < paths.length; index++) {
    const callback = paths[index];
    unstable_runWithPriority(eventTypeToSchudlerPriority(se.type), () => {
      callback.call(null, se);
    });
    if (se.__stopPropagation) {
      break;
    }
  }
}

function eventTypeToSchudlerPriority(eventType: string) {
  switch (eventType) {
    case "click":
    case "keydown":
    case "keyup":
      return unstable_ImmediatePriority;
    case "scroll":
      return unstable_UserBlockingPriority;
    default:
      return unstable_NormalPriority;
  }
}
