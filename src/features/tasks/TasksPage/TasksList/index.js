import { useSelector, useDispatch } from "react-redux";
import { selectHideDone, toggleTaskDone, setTaskToEdit, removeTasks, selectTasksByQuery, selectEditedTask, selectTasks, selectListName } from "../../tasksSlice";
import { List, Item, Content, Task, StyledLink } from "./styled";
import { useQueryParameter } from "../queryParameter";
import searchQueryParamName from "../searchQueryParamName";
import { formatCurrentDate } from "../../../../utils/formatCurrentDate";
import { EditButton, RemoveButton, ToggleButton } from "../../../../common/buttons";

const TasksList = () => {
  const query = useQueryParameter(searchQueryParamName);
  const tasksByQuery = useSelector(state => selectTasksByQuery(state, query));
  const tasks = useSelector(selectTasks);
  const listName = useSelector(selectListName);
  const hideDone = useSelector(selectHideDone);
  const editedTask = useSelector(selectEditedTask);
  const dispatch = useDispatch();
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
            onClick={() => dispatch(toggleTaskDone({ taskId: task.id, doneDate: task.done ? null : date, stateForUndo: { tasks, listName } }))}
            disabled={editedTask !== null}
          >
            {task.done ? "✔" : ""}
          </ToggleButton>
          <Content>
            {(!query) ? <span>{index + 1}. </span> : ""}
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
            onClick={() => dispatch(removeTasks({ taskId: task.id, stateForUndo: { tasks, listName } }))}
            disabled={editedTask !== null}
          >
            🗑️
          </RemoveButton>
        </Item>
      ))}
    </List>
  );
};

export default TasksList;