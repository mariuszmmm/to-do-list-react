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
import { useEffect } from "react";
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

  return (
    <StyledList>
      {tasksLst.map((task, index) => (
        <StyledListItem
          key={task.id}
          hidden={task.done && hideDone}
          $edit={editedTaskContent?.id === task.id}
          $type={isTasksSorting ? "sort" : "tasks"}
        >

          {isTasksSorting && tasksToSort ?
            <SortButton
              onClick={() => dispatch(setTasksToSort(moveListUp(index, tasksToSort)))}
              disabled={index === 0}
            >
              <ArrowUpIcon />
            </SortButton>
            :
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
          }

          <StyledListContent $type={isTasksSorting ? "sort" : "tasks"}>
            {!query ? <TaskNumber>{`${index + 1}. `}</TaskNumber> : ""}
            <StyledSpan $done={task.done}>
              <StyledLink
                to={`/tasks/${task.id}`}
                disabled={!!editedTaskContent}
              >
                {task.content}
              </StyledLink>
            </StyledSpan>
          </StyledListContent>

          {isTasksSorting && tasksToSort ?
            <SortButton
              onClick={() => dispatch(setTasksToSort(moveListDown(index, tasksToSort)))}
              disabled={index === tasksLst.length - 1}
            >
              <ArrowDownIcon />
            </SortButton>
            :
            <>
              <EditButton
                onClick={() => dispatch(setTaskToEdit(task.id))}
                disabled={!!editedTaskContent}
              >
                ✏️
              </EditButton>
              <RemoveButton
                onClick={() =>
                  dispatch(
                    removeTask({
                      taskId: task.id,
                      stateForUndo: { tasks, taskListMetaData },
                      isRemoteSaveable
                    }),
                  )
                }
                disabled={!!editedTaskContent}
              >
                🗑️
              </RemoveButton>
            </>
          }
        </StyledListItem>
      ))}
    </StyledList>
  );
};
