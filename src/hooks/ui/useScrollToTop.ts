import { useEffect } from "react";
import { scrollToTop } from "../../utils/ui/scrollToTop";

export const useScrollToTop = () => {
  useEffect(() => {
    scrollToTop();
  }, []);
};
