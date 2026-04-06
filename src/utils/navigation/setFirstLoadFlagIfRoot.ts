export const setInputAutoFocusFlagIfRoot = () => {
  const { pathname } = window.location;
  if (pathname === "/") {
    sessionStorage.setItem("inputAutoFocusFirstLoad", "true");
  }
};

export const clearInputAutoFocusFlag = () => {
  sessionStorage.removeItem("inputAutoFocusFirstLoad");
};
