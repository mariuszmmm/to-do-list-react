import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { useQueryParameter } from "../../../../hooks/useQueryParameter";
import { StyledLink } from "../../../../common/StyledLink";
import searchQueryParamName from "../../../../utils/searchQueryParamName";
import {
  EditButton,
  RemoveButton,
  SortButton,
  SortButtonsContainer,
  ToggleButton,
} from "../../../../common/taskButtons";
import {
  selectHideDone,
  toggleTaskDone,
  setTaskToEdit,
  removeTask,
  selectTasksByQuery,
  selectEditedTask,
  selectTasks,
  selectTaskListMetaData,
  taskMoveUp,
  taskMoveDown,
  selectIsTasksSorting,
} from "../../tasksSlice";
import { ArrowDownIcon, ArrowUpIcon } from "../../../../common/icons";
import { useEffect } from "react";
import {
  StyledList,
  StyledListContent,
  StyledListItem,
  StyledTask,
  TaskNumber,
} from "../../../../common/StyledList";

export const TasksList = () => {
  const query = useQueryParameter(searchQueryParamName);
  const tasks = useAppSelector(selectTasks);
  const taskListMetaData = useAppSelector(selectTaskListMetaData);
  const hideDone = useAppSelector(selectHideDone);
  const editedTask = useAppSelector(selectEditedTask);
  const isTasksSorting = useAppSelector(selectIsTasksSorting);
  const tasksByQuery = useAppSelector((state) =>
    selectTasksByQuery(state, query),
  );
  const dispatch = useAppDispatch();
  const date = new Date().toISOString();

  useEffect(() => {
    if (!editedTask) return;
    window.scrollTo(0, 0);
  }, [editedTask]);

  return (
    <StyledList>
      {tasksByQuery.map((task, index) => (
        <StyledListItem
          key={task.id}
          hidden={task.done && hideDone}
          $edit={editedTask?.id === task.id}
          $type={"tasks"}
        >
          {isTasksSorting ? (
            <SortButtonsContainer>
              <SortButton
                onClick={() => dispatch(taskMoveUp(index))}
                disabled={index === 0}
              >
                <ArrowUpIcon />
              </SortButton>
              <SortButton
                onClick={() => dispatch(() => dispatch(taskMoveDown(index)))}
                disabled={index === tasksByQuery.length - 1}
              >
                <ArrowDownIcon />
              </SortButton>
            </SortButtonsContainer>
          ) : (
            <ToggleButton
              onClick={() =>
                dispatch(
                  toggleTaskDone({
                    taskId: task.id,
                    doneDate: task.done ? null : date,
                    stateForUndo: { tasks, taskListMetaData },
                  }),
                )
              }
              disabled={editedTask !== null}
            >
              {task.done ? "✔" : ""}
            </ToggleButton>
          )}
          <StyledListContent $type={"tasks"}>
            {!query ? <TaskNumber>{`${index + 1}. `}</TaskNumber> : ""}
            <StyledTask $done={task.done}>
              <StyledLink
                to={`/tasks/${task.id}`}
                disabled={editedTask !== null}
              >
                {task.content}
              </StyledLink>
            </StyledTask>
          </StyledListContent>
          {!isTasksSorting && (
            <>
              <EditButton
                onClick={() => dispatch(setTaskToEdit(task.id))}
                disabled={!!editedTask}
              >
                ✏️
              </EditButton>
              <RemoveButton
                onClick={() =>
                  dispatch(
                    removeTask({
                      taskId: task.id,
                      stateForUndo: { tasks, taskListMetaData },
                    }),
                  )
                }
                disabled={editedTask !== null}
              >
                🗑️
              </RemoveButton>
            </>
          )}
        </StyledListItem>
      ))}
    </StyledList>
  );
};
