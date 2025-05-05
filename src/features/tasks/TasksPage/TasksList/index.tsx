import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { useQueryParameter } from "../../../../hooks/useQueryParameter";
import { StyledLink } from "../../../../common/StyledLink";
import { List, Item, Content, Task } from "./styled";
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
  selectTasksByQuery,
  selectEditedTask,
  selectTasks,
  selectListName,
  taskMoveUp,
  taskMoveDown,
  selectIsTasksSorting,
} from "../../tasksSlice";
import { SortButtonsContainer } from "../../../../common/taskButtons/SortButtonsContainer";
import { ArrowDownIcon, ArrowUpIcon } from "../../../../common/icons";

export const TasksList = () => {
  const query = useQueryParameter(searchQueryParamName);
  const tasks = useAppSelector(selectTasks);
  const listName = useAppSelector(selectListName);
  const hideDone = useAppSelector(selectHideDone);
  const editedTask = useAppSelector(selectEditedTask);
  const isTasksSorting = useAppSelector(selectIsTasksSorting);
  const tasksByQuery = useAppSelector((state) =>
    selectTasksByQuery(state, query)
  );
  const dispatch = useAppDispatch();
  const date = new Date().toISOString();

  return (
    <List>
      {tasksByQuery.map((task, index) => (
        <Item
          key={task.id}
          hidden={task.done && hideDone}
          $edit={editedTask?.id === task.id}
          $sort={isTasksSorting}
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
                    stateForUndo: { tasks, listName },
                  })
                )
              }
              disabled={editedTask !== null}
            >
              {task.done ? "✔" : ""}
            </ToggleButton>
          )}
          <Content>
            {!query ? <span>{index + 1}. </span> : ""}
            <Task $done={task.done}>
              <StyledLink to={`/tasks/${task.id}`}>{task.content}</StyledLink>
            </Task>
          </Content>
          {!isTasksSorting && (
            <>
              <EditButton
                onClick={() =>
                  dispatch(setTaskToEdit(!!editedTask ? null : task.id))
                }
                disabled={!!editedTask && editedTask.id !== task.id}
              >
                {!!editedTask && editedTask.id === task.id ? "↩︎" : "✏️"}
              </EditButton>
              <RemoveButton
                onClick={() =>
                  dispatch(
                    removeTask({
                      taskId: task.id,
                      stateForUndo: { tasks, listName },
                    })
                  )
                }
                disabled={editedTask !== null}
              >
                🗑️
              </RemoveButton>
            </>
          )}
        </Item>
      ))}
    </List>
  );
};
