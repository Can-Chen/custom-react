import currentDispatcher, {
  Dispatcher,
  resolveDispatcher,
} from "./src/currentDispatcher";
import { jsxDEV } from "./src/jsx";

export const useState: Dispatcher["useState"] = (initialState) => {
  const dispatcher = resolveDispatcher();
  return dispatcher.useState(initialState);
};

export const __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = {
  currentDispatcher,
};

export default {
  createElement: jsxDEV,
  version: "0.0.0",
};
