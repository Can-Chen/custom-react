import { REACT_ELEMENT_TYPE } from "shared/ReactSymbols";
import type {
  Type,
  Key,
  Ref,
  Props,
  ReactElement,
  ElementType,
} from "shared/ReactTypes";

const ReactElement = function (type: Type, key: Key, ref: Ref, props: Props) {
  const element: ReactElement = {
    $$typeof: REACT_ELEMENT_TYPE,
    type,
    key,
    ref,
    props,
    __mark: "cc",
  };

  return element;
};

export const createElemet = (
  type: ElementType,
  config: any,
  ...maybeChildren: any[]
) => {
  let key: Key = null;
  const props: Props = {};
  let ref: Ref = null;

  for (const prop in config) {
    const val = config[prop];
    if (prop === "key") {
      if (val !== undefined) {
        key = "" + val;
      }
      continue;
    }
    if (prop === "ref") {
      if (val !== undefined) {
        ref = val;
      }
      continue;
    }
    if ({}.hasOwnProperty.call(config, prop)) {
      props[prop] = val;
    }
  }
  const maybeChildrenLength = maybeChildren.length;
  if (maybeChildrenLength) {
    if (maybeChildrenLength === 1) {
      props.children = maybeChildren[0];
    } else {
      props.children = maybeChildren;
    }
  }
  return ReactElement(type, key, ref, props);
};

export const jsx = (type: ElementType, config: any, maybeKey: any) => {
  let key: Key = null;
  const props: Props = {};
  let ref: Ref = null;

  if (maybeKey !== undefined) {
    key = "" + maybeKey;
  }

  for (const prop in config) {
    const val = config[prop];
    if (prop === "key") {
      if (val !== undefined) {
        key = "" + val; // react中的key是字符串？？？
      }
      continue;
    }
    if (prop === "ref") {
      if (val !== undefined) {
        ref = val;
      }
      continue;
    }
    // 判断prop确实是config的自有属性
    // 排除原型上的属性
    if ({}.hasOwnProperty.call(config, prop)) {
      props[prop] = val;
    }
  }

  return ReactElement(type, key, ref, props);
};

// react源码中有不一样的处理 dev有一些额外的检查和warning打印
export const jsxDev = jsx;
