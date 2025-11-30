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
  selectEditedTask,
  selectTasks,
  selectTaskListMetaData,
  taskMoveUp,
  taskMoveDown,
  selectIsTasksSorting,
  selectActiveTasksByQuery,
  selectListStatus,
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

export const TasksList = () => {
  const query = useQueryParameter(searchQueryParamName);
  const tasks = useAppSelector(selectTasks);
  const taskListMetaData = useAppSelector(selectTaskListMetaData);
  const hideDone = useAppSelector(selectHideDone);
  const editedTaskContent = useAppSelector(selectEditedTask);
  const isTasksSorting = useAppSelector(selectIsTasksSorting);
  const filteredTasks = useAppSelector(state => selectActiveTasksByQuery(state, query));
  const { isRemoteSaveable } = useAppSelector(selectListStatus)

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!editedTaskContent) return;
    window.scrollTo(0, 0);
  }, [editedTaskContent]);

  return (
    <StyledList>
      {filteredTasks.map((task, index) => (
        <StyledListItem
          key={task.id}
          hidden={task.done && hideDone}
          $edit={editedTaskContent?.id === task.id}
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
                disabled={index === filteredTasks.length - 1}
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
                    stateForUndo: { tasks, taskListMetaData },
                  }),
                )
              }
              disabled={!!editedTaskContent}
            >
              {task.done ? "✔" : ""}
            </ToggleButton>
          )}
          <StyledListContent $type={"tasks"}>
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
          {!isTasksSorting && (
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
          )}
        </StyledListItem>
      ))}
    </StyledList>
  );
};
