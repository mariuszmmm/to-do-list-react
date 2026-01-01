import { useRef, useState, useCallback, RefCallback } from "react";
import {
  getNeighborHeight,
  getAnimationDuration,
  runFlipAnimation,
  animateScroll,
} from "../common/listAnimation/listMoveAnimation";

/**
 * Hook for animating sortable list rows with smooth transitions.
 * Provides refs and animation logic for moving rows up or down.
 */
export function useSortableRowAnimation<T = any>({
  index,
  list,
  setList,
  moveUp,
  moveDown,
}: {
  index: number;
  list: T[] | null | undefined;
  setList: (next: T[]) => void;
  moveUp: (index: number, list: T[]) => T[];
  moveDown: (index: number, list: T[]) => T[];
}) {
  const [isAnimating, setIsAnimating] = useState(false);
  const rowRef = useRef<HTMLLIElement | null>(null);

  // Ref callback for the row element
  const setRefs: RefCallback<HTMLLIElement> = useCallback((el) => {
    rowRef.current = el;
  }, []);

  /**
   * Animate moving the row up or down with FLIP animation and scroll adjustment.
   */
  const animateMove = useCallback(
    (direction: "up" | "down") => {
      if (isAnimating || !list) return;
      const current = rowRef.current;
      const neighbor =
        direction === "up"
          ? (current?.previousElementSibling as HTMLElement | null)
          : (current?.nextElementSibling as HTMLElement | null);
      if (!current || !neighbor) return;

      const neighborHeight = getNeighborHeight(neighbor);
      const beforeCurrent = current.getBoundingClientRect();
      const beforeNeighbor = neighbor.getBoundingClientRect();
      setIsAnimating(true);
      const duration = getAnimationDuration(neighborHeight);

      setList(direction === "up" ? moveUp(index, list) : moveDown(index, list));

      runFlipAnimation({
        current,
        neighbor,
        beforeCurrent,
        beforeNeighbor,
        duration,
        onFinish: () => {
          const scrollDelta =
            direction === "down" ? neighborHeight : -neighborHeight;
          animateScroll(scrollDelta, duration);
          setIsAnimating(false);
        },
      });
    },
    [isAnimating, list, setList, moveUp, moveDown, index]
  );

  return { rowRef, setRefs, animateMove, isAnimating };
}
