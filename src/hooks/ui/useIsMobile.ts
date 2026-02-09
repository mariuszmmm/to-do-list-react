import { useEffect, useState } from "react";

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const hasCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
      setIsMobile(hasTouch && hasCoarsePointer);
    };
    checkMobile();
  }, []);

  return isMobile;
};
