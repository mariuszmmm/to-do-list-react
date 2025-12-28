import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { useQueryParameter } from "../../../../hooks/useQueryParameter";
import { StyledLink } from "../../../../common/StyledLink";
import searchQueryParamName from "../../../../utils/searchQueryParamName";
import {
  EditButton,
  RemoveButton,
  SortButton,
  ToggleButton,
} from "../../../../common/taskButtons";
import {
  selectHideDone,
  toggleTaskDone,
  setTaskToEdit,
  removeTask,
  selectEditedTask,
  selectTasks,
  selectTaskListMetaData,
  selectIsTasksSorting,
  selectActiveTasksByQuery,
  selectListStatus,
  selectTasksToSort,
  setTasksToSort,
  setTasks,
} from "../../tasksSlice";
import { ArrowDownIcon, ArrowUpIcon } from "../../../../common/icons";
import { useDndList } from "../../../../hooks/useDndList";
import { useDndItem } from "../../../../hooks/useDndItem";
import type { DraggableAttributes } from "@dnd-kit/core";
import { useEffect, useRef } from "react";
import {
  StyledList,
  StyledListContent,
  StyledListItem,
  StyledSpan,
  TaskNumber,
} from "../../../../common/StyledList";
import { moveListDown, moveListUp } from "../../../../utils/moveList";

export const TasksList = () => {
  const query = useQueryParameter(searchQueryParamName);
  const tasks = useAppSelector(selectTasks);
  const taskListMetaData = useAppSelector(selectTaskListMetaData);
  const hideDone = useAppSelector(selectHideDone);
  const editedTaskContent = useAppSelector(selectEditedTask);
  const isTasksSorting = useAppSelector(selectIsTasksSorting);
  const tasksToSort = useAppSelector(selectTasksToSort);
  const filteredTasks = useAppSelector(state => selectActiveTasksByQuery(state, query));
  const tasksLst = tasksToSort || filteredTasks || tasks;
  const { isRemoteSaveable } = useAppSelector(selectListStatus);
  const dispatch = useAppDispatch();

  // DnD list wrapper initialized below when needed

  useEffect(() => {
    if (!editedTaskContent) return;
    window.scrollTo(0, 0);
  }, [editedTaskContent]);

  useEffect(() => {
    if (!tasks) return;
    if (isTasksSorting) {
      dispatch(setTasksToSort(tasks));
    } else {
      if (!tasksToSort) return;
      dispatch(setTasks({
        taskListMetaData: taskListMetaData,
        tasks: tasksToSort,
        stateForUndo: { tasks, taskListMetaData }
      }))
      dispatch(setTasksToSort(null));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTasksSorting]);

  const dnd = useDndList({
    items: tasksLst,
    isSorting: !!isTasksSorting && !!tasksToSort,
    getId: (t: any) => t.id,
    onReorder: (next: any[]) => dispatch(setTasksToSort(next)),
  });


  const SortableTaskRow = ({ task, index }: { task: any; index: number }) => {
    const { dragProps } = useDndItem(task.id, true);
    const rowRef = useRef<HTMLLIElement | null>(null);
    const setRefs = (el: HTMLLIElement | null) => {
      rowRef.current = el;
      dragProps.setNodeRef(el as unknown as HTMLElement | null);
    };

    const keepAnchored = (doMove: () => void, direction: "up" | "down") => {
      const scrollEl = document.scrollingElement || document.documentElement || (document.body as HTMLElement);
      const beforeScrollTop = scrollEl.scrollTop;
      const getFullHeight = (el: HTMLElement | null): number => {
        if (!el) return 0;
        const rect = el.getBoundingClientRect();
        const styles = getComputedStyle(el);
        const mt = parseFloat(styles.marginTop) || 0;
        const mb = parseFloat(styles.marginBottom) || 0;
        return rect.height + mt + mb;
      };
      const neighbor = direction === "down"
        ? (rowRef.current?.nextElementSibling as HTMLElement | null)
        : (rowRef.current?.previousElementSibling as HTMLElement | null);
      const amountAbs = getFullHeight(neighbor) || getFullHeight(rowRef.current);
      doMove();
      // Apply after React commit + layout
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const amount = direction === "down" ? amountAbs : -amountAbs;
          if (amount !== 0) {
            scrollEl.scrollTop = beforeScrollTop + amount;
          }
        });
      });
    };
    return (
      <StyledListItem
        key={task.id}
        hidden={task.done && hideDone}
        $edit={editedTaskContent?.id === task.id}
        $type={"sort"}
        ref={setRefs}
        style={dragProps.style}
        {...(dragProps.attributes as DraggableAttributes)}
        {...(dragProps.listeners || {})}
      >
        <SortButton
          onClick={() => keepAnchored(() => dispatch(setTasksToSort(moveListUp(index, tasksToSort!))), "up")}
          disabled={index === 0}
        >
          <ArrowUpIcon />
        </SortButton>
        <StyledListContent $type={"sort"}>
          {!query ? <TaskNumber>{`${index + 1}. `}</TaskNumber> : ""}
          <StyledSpan $done={task.done}>
            <StyledLink to={`/tasks/${task.id}`} disabled={!!editedTaskContent}>
              {task.content}
            </StyledLink>
          </StyledSpan>
        </StyledListContent>
        <SortButton
          onClick={() => keepAnchored(() => dispatch(setTasksToSort(moveListDown(index, tasksToSort!))), "down")}
          disabled={index === tasksLst.length - 1}
        >
          <ArrowDownIcon />
        </SortButton>
      </StyledListItem>
    );
  };

  if (isTasksSorting && tasksToSort) {
    return dnd.withDnd(
      <StyledList>
        {tasksLst.map((task: any, index: number) => (
          <SortableTaskRow key={task.id} task={task} index={index} />
        ))}
      </StyledList>
    );
  }

  return (
    <StyledList>
      {tasksLst.map((task, index) => (
        <StyledListItem key={task.id} hidden={task.done && hideDone} $edit={editedTaskContent?.id === task.id} $type={"tasks"}>
          <ToggleButton
            onClick={() =>
              dispatch(
                toggleTaskDone({
                  taskId: task.id,
                  stateForUndo: { tasks, taskListMetaData },
                }),
              )
            }
            disabled={!!editedTaskContent}
          >
            {task.done ? "✔" : ""}
          </ToggleButton>
          <StyledListContent $type={"tasks"}>
            {!query ? <TaskNumber>{`${index + 1}. `}</TaskNumber> : ""}
            <StyledSpan $done={task.done}>
              <StyledLink to={`/tasks/${task.id}`} disabled={!!editedTaskContent}>
                {task.content}
              </StyledLink>
            </StyledSpan>
          </StyledListContent>
          <>
            <EditButton onClick={() => dispatch(setTaskToEdit(task.id))} disabled={!!editedTaskContent}>
              ✏️
            </EditButton>
            <RemoveButton
              onClick={() =>
                dispatch(
                  removeTask({
                    taskId: task.id,
                    stateForUndo: { tasks, taskListMetaData },
                    isRemoteSaveable,
                  }),
                )
              }
              disabled={!!editedTaskContent}
            >
              🗑️
            </RemoveButton>
          </>
        </StyledListItem>
      ))}
    </StyledList>
  );
};
