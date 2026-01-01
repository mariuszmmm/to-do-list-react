import { CSSProperties } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { DraggableAttributes } from "@dnd-kit/core";

type DragProps = {
  setNodeRef: (element: HTMLElement | null) => void;
  style: CSSProperties;
  attributes: DraggableAttributes;
  listeners?: Record<string, unknown>;
};

/**
 * Hook for enabling drag-and-drop sorting of items using dnd-kit.
 * Returns drag-and-drop props for sortable list items.
 */
export const useDndItem = (id: string, isSorting: boolean) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: !isSorting });

  // Merge background color transition with dnd-kit transition
  const bgTransition = "background-color 1s";
  const mergedTransition = transition
    ? `${transition}, ${bgTransition}`
    : bgTransition;

  // Style for the draggable item
  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: mergedTransition,
    cursor: isSorting ? "grab" : "default",
    opacity: isDragging ? 0.85 : 1,
    backgroundColor: isDragging ? "#dcdcdcff" : undefined,
  };

  // Props to spread on the draggable element
  const dragProps: DragProps = { setNodeRef, attributes, listeners, style };

  return { dragProps };
};
