/**
 * Hook for checking if a given sessionStorage key is set to 'true'.
 * Used to determine if autofocus should be enabled for a form field.
 */
export const useAutoFocusFlag = (key: string): boolean => {
  return sessionStorage.getItem(key) === "true";
};
