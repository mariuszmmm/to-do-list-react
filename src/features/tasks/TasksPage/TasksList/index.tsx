import { useAppDispatch, useAppSelector } from "../../../../hooks";
import { useQueryParameter } from "../../../../hooks/useQueryParameter";
import { StyledLink } from "../../../../common/StyledLink";
import { List, Item, Content, Task } from "./styled";
import searchQueryParamName from "../../../../utils/searchQueryParamName";
import { formatCurrentDate } from "../../../../utils/formatCurrentDate";
import {
  EditButton,
  RemoveButton,
  ToggleButton,
} from "../../../../common/taskButtons";
import {
  selectHideDone,
  toggleTaskDone,
  setTaskToEdit,
  removeTasks,
  selectTasksByQuery,
  selectEditedTask,
  selectTasks,
  selectListName,
} from "../../tasksSlice";

export const TasksList = () => {
  const query = useQueryParameter(searchQueryParamName);
  const tasks = useAppSelector(selectTasks);
  const listName = useAppSelector(selectListName);
  const hideDone = useAppSelector(selectHideDone);
  const editedTask = useAppSelector(selectEditedTask);
  const tasksByQuery = useAppSelector((state) =>
    selectTasksByQuery(state, query)
  );
  const dispatch = useAppDispatch();
  const date = formatCurrentDate(new Date());

  return (
    <List>
      {tasksByQuery.map((task, index) => (
        <Item
          key={task.id}
          hidden={task.done && hideDone}
          $edit={editedTask?.id === task.id}
        >
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
          <Content>
            {!query ? <span>{index + 1}. </span> : ""}
            <Task $done={task.done}>
              <StyledLink to={`/zadania/${task.id}`}>{task.content}</StyledLink>
            </Task>
          </Content>
          <EditButton
            onClick={() => dispatch(setTaskToEdit(task.id))}
            disabled={editedTask !== null}
          >
            ✏️
          </EditButton>
          <RemoveButton
            onClick={() =>
              dispatch(
                removeTasks({
                  taskId: task.id,
                  stateForUndo: { tasks, listName },
                })
              )
            }
            disabled={editedTask !== null}
          >
            🗑️
          </RemoveButton>
        </Item>
      ))}
    </List>
  );
};
