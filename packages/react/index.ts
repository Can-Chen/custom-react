import currentBatchConfig from "./src/currentBatchConfig";
import currentDispatcher, {
  Dispatcher,
  resolveDispatcher,
} from "./src/currentDispatcher";
import { jsxDEV, jsx, isValidElement as isValidElementFn } from "./src/jsx";

export const useState: Dispatcher["useState"] = (initialState) => {
  const dispatcher = resolveDispatcher();
  return dispatcher.useState(initialState);
};

export const useEffect: Dispatcher["useEffect"] = (callback, deps) => {
  const dispatcher = resolveDispatcher();
  return dispatcher.useEffect(callback, deps);
};

export const useTransition: Dispatcher["useTransition"] = () => {
  const dispatcher = resolveDispatcher();
  return dispatcher.useTransition();
};

export const __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = {
  currentDispatcher,
  currentBatchConfig,
};

export const version = "0.0.0";

// TODO 根据环境区分使用jsx/jsxDEV
export const createElement = jsx;
export const isValidElement = isValidElementFn;
