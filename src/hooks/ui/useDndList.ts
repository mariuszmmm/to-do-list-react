import {
  MouseSensor,
  TouchSensor,
  DndContext,
  DragEndEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { arrayMove } from "@dnd-kit/sortable";
import React, { ReactNode, useMemo } from "react";

type UseDndListParams<T> = {
  items: T[];
  isSorting: boolean;
  getId: (item: T) => string;
  onReorder: (nextItems: T[]) => void;
};

export const useDndList = <T>({
  items,
  isSorting,
  getId,
  onReorder,
}: UseDndListParams<T>) => {
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 8,
      },
    }),
  );

  const sortableIds = useMemo(() => items.map(getId), [items, getId]);

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!isSorting || !over) return;
    const oldIndex = items.findIndex((it) => getId(it) === active.id);
    const newIndex = items.findIndex((it) => getId(it) === over.id);
    if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;
    onReorder(arrayMove(items, oldIndex, newIndex));
  };

  const withDnd = (children: ReactNode) =>
    React.createElement(
      DndContext,
      { sensors, onDragEnd: handleDragEnd },
      React.createElement(
        SortableContext as any,
        { items: sortableIds, strategy: verticalListSortingStrategy },
        children as any,
      ),
    );

  return { sensors, sortableIds, handleDragEnd, withDnd };
};
