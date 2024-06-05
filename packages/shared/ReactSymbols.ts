const supportSymbol = typeof Symbol === "function" && Symbol.for;

export const REACT_ELEMENT_TYPE = supportSymbol
  ? Symbol.for("react.element")
  : 0xeac7;

export const REACT_FARGMENT_TYPE = supportSymbol
  ? Symbol.for("react.fragment")
  : 0xeacb;
