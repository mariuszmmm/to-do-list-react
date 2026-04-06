import { useEffect } from "react";

/**
 * Hook to block scrolling of the body element.
 * @param lock If true, scrolling is blocked.
 */
export const useScrollLock = (lock: boolean) => {
  useEffect(() => {
    if (lock) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [lock]);
};
