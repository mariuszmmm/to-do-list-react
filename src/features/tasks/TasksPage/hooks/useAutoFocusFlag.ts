export const useAutoFocusFlag = (key: string): boolean => {
  return sessionStorage.getItem(key) === "true";
};
