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

export const useDndItem = (id: string, isSorting: boolean) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: !isSorting });

  const bgTransition = "background-color 1s";
  const mergedTransition = transition
    ? `${transition}, ${bgTransition}`
    : bgTransition;

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: mergedTransition,
    cursor: isSorting ? "grab" : "default",
    opacity: isDragging ? 0.85 : 1,
  };

  const dragProps: DragProps = { setNodeRef, attributes, listeners, style };

  return { dragProps };
};
