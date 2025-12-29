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
import { useEffect } from "react";
import {
  StyledList,
  StyledListContent,
  StyledListItem,
  StyledSpan,
  TaskNumber,
} from "../../../../common/StyledList";
import { moveListDown, moveListUp } from "../../../../utils/moveList";
import { useSortableRowAnimation } from "../../../../hooks/useSortableRowAnimation";
import { Task } from "../../../../types";

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

  const { withDnd } = useDndList({
    items: tasksLst,
    isSorting: isTasksSorting && !!tasksToSort,
    getId: (t) => t.id,
    onReorder: (next) => dispatch(setTasksToSort(next)),
  });

  const SortableTaskRow = ({ task, index }: { task: Task; index: number }) => {
    const { dragProps } = useDndItem(task.id, true);
    const { setRefs, animateMove, isAnimating } = useSortableRowAnimation({
      index,
      list: tasksToSort,
      setList: (next: Task[]) => dispatch(setTasksToSort(next)),
      moveUp: moveListUp,
      moveDown: moveListDown,
    });
    const combinedRef = (el: HTMLLIElement | null) => {
      setRefs(el);
      dragProps.setNodeRef(el as unknown as HTMLElement | null);
    };

    return (
      <StyledListItem
        key={task.id}
        $edit={editedTaskContent?.id === task.id}
        $type={"sort"}
        ref={combinedRef}
        style={dragProps.style}
        {...(dragProps.attributes as DraggableAttributes)}
        {...(dragProps.listeners || {})}
      >
        <SortButton
          onClick={() => animateMove("up")}
          disabled={index === 0 || isAnimating}
        >
          <ArrowUpIcon />
        </SortButton>
        <StyledListContent $type={"sort"}>
          <TaskNumber>{`${index + 1}. `}</TaskNumber>
          <StyledSpan $done={task.done} $noLink>
            {task.content}
          </StyledSpan>
        </StyledListContent>
        <SortButton
          onClick={() => animateMove("down")}
          disabled={index === tasksLst.length - 1 || isAnimating}
        >
          <ArrowDownIcon />
        </SortButton>
      </StyledListItem>
    );
  };

  if (isTasksSorting && tasksToSort) {
    return withDnd(
      <StyledList>
        {tasksLst.map((task, index) => (
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
