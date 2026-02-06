import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { useQueryParameter } from "../../../../hooks/useQueryParameter";
import { StyledLink } from "../../../../common/StyledLink";
import searchQueryParamName from "../../../../utils/searchQueryParamName";
import { EditButton, ImageButton, RemoveButton, SortButton, ToggleButton } from "../../../../common/taskButtons";
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
import { ArrowDownIcon, ArrowUpIcon, DragHandleIcon } from "../../../../common/icons";
import { useDndList } from "../../../../hooks/useDndList";
import { useDndItem } from "../../../../hooks/useDndItem";
import type { DraggableAttributes } from "@dnd-kit/core";
import { useEffect } from "react";
import { StyledList, StyledListContent, StyledListItem, StyledSpan, TaskNumber } from "../../../../common/StyledList";
import { moveListDown, moveListUp } from "../../../../utils/moveList";
import { useSortableRowAnimation } from "../../../../hooks/useSortableRowAnimation";
import { Task } from "../../../../types";
import { TaskActions } from "../../../../common/TaskActions";
import { selectLoggedUserEmail } from "../../../AccountPage/accountSlice";
import type { TaskFormApi } from "../TaskForm/hooks/useTaskForm";

export const TasksList = ({ taskForm }: { taskForm: TaskFormApi }) => {
  const query = useQueryParameter(searchQueryParamName);
  const tasks = useAppSelector(selectTasks);
  const taskListMetaData = useAppSelector(selectTaskListMetaData);
  const hideDone = useAppSelector(selectHideDone);
  const editedTaskContent = useAppSelector(selectEditedTask);
  const isTasksSorting = useAppSelector(selectIsTasksSorting);
  const tasksToSort = useAppSelector(selectTasksToSort);
  const filteredTasks = useAppSelector((state) => selectActiveTasksByQuery(state, query));
  const tasksLst = tasksToSort || filteredTasks || tasks;
  const { isRemoteSaveable } = useAppSelector(selectListStatus);
  const loggedUserEmail = useAppSelector(selectLoggedUserEmail);
  const dispatch = useAppDispatch();
  const { speech } = taskForm;

  useEffect(() => {
    if (!tasks) return;

    if (isTasksSorting) {
      const addedTasks = tasks.filter(
        (task) => !tasksToSort?.some((t) => t.id === task.id || t.content === task.content),
      );
      const sortedExistingTasks = tasksToSort?.filter((task) =>
        tasks.some((t) => t.id === task.id && t.content === task.content),
      );

      dispatch(setTasksToSort([...(sortedExistingTasks ?? []), ...addedTasks]));
    } else {
      if (!tasksToSort) return;
      const tasks = tasksToSort.map((task) => ({
        ...task,
        status: "updated" as const,
      }));

      dispatch(
        setTasks({
          taskListMetaData: taskListMetaData,
          tasks: tasksToSort,
          stateForUndo: { tasks, taskListMetaData },
        }),
      );
      dispatch(setTasksToSort(null));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTasksSorting, tasks]);

  const { withDnd } = useDndList({
    items: tasksLst,
    isSorting: isTasksSorting && !!tasksToSort,
    getId: (t) => t.id,
    onReorder: (next) => dispatch(setTasksToSort(next)),
  });

  const SortableTaskRow = ({ task, index }: { task: Task; index: number }) => {
    const { dragProps, isDragging } = useDndItem(task.id, true);
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
        $isDragging={isDragging}
        ref={combinedRef}
        style={dragProps.style}
        {...(dragProps.attributes as DraggableAttributes)}
        {...(dragProps.listeners || {})}
      >
        <DragHandleIcon>
          <span />
        </DragHandleIcon>

        <StyledListContent $type={"sort"}>
          <TaskNumber $isDragging={isDragging}>{`${index + 1}. `}</TaskNumber>
          <StyledSpan $done={task.done} $noLink $isDragging={isDragging}>
            {task.content}
          </StyledSpan>
        </StyledListContent>
        <div style={{ display: "flex", gap: "10px" }}>
          <SortButton onClick={() => animateMove("up")} disabled={index === 0 || isAnimating}>
            <ArrowUpIcon />
          </SortButton>
          <SortButton onClick={() => animateMove("down")} disabled={index === tasksLst.length - 1 || isAnimating}>
            <ArrowDownIcon />
          </SortButton>
        </div>
      </StyledListItem>
    );
  };

  if (isTasksSorting && tasksToSort) {
    return withDnd(
      <StyledList>
        {tasksLst.map((task, index) => (
          <SortableTaskRow key={task.id} task={task} index={index} />
        ))}
      </StyledList>,
    );
  }

  return (
    <StyledList>
      {tasksLst.map((task, index) => (
        <StyledListItem
          key={task.id}
          hidden={task.done && hideDone}
          $edit={editedTaskContent?.id === task.id}
          $type={"tasks"}
        >
          <TaskActions>
            <ToggleButton
              onClick={() =>
                dispatch(
                  toggleTaskDone({
                    taskId: task.id,
                    stateForUndo: { tasks, taskListMetaData },
                  }),
                )
              }
              disabled={!!editedTaskContent || speech.isActive}
            >
              {task.done ? "✔" : ""}
            </ToggleButton>
          </TaskActions>
          <StyledListContent $type={"tasks"}>
            {!query ? <TaskNumber $edit={editedTaskContent?.id === task.id}>{`${index + 1}. `}</TaskNumber> : ""}
            <StyledSpan $done={task.done} disabled={!!editedTaskContent}>
              <StyledLink
                to={`/tasks/${task.id}`}
                $edit={editedTaskContent?.id === task.id}
                disabled={!!editedTaskContent}
              >
                {task.content}
              </StyledLink>
            </StyledSpan>
          </StyledListContent>
          <TaskActions>
            <EditButton
              onClick={() => dispatch(setTaskToEdit(task.id))}
              disabled={!!editedTaskContent || speech.isActive}
            >
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
              disabled={!!editedTaskContent || speech.isActive}
            >
              🗑️
            </RemoveButton>

            {loggedUserEmail && (
              <ImageButton disabled={!!editedTaskContent || speech.isActive || !isRemoteSaveable}>
                <StyledLink
                  to={`/tasks/image/${task.id}`}
                  disabled={!!editedTaskContent || speech.isActive || !isRemoteSaveable}
                >
                  📷
                </StyledLink>
              </ImageButton>
            )}
          </TaskActions>
        </StyledListItem>
      ))}
    </StyledList>
  );
};
