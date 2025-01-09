import { useSelector, useDispatch } from "react-redux";
import { selectHideDone, toggleTaskDone, editTask, removeTasks, selectTasksByQuery, selectEditedTask } from "../../tasksSlice";
import { List, Item, ToggleButton, Content, Task, RemoveButton, StyledLink, EditButton } from "./styled";
import { useQueryParameter } from "../queryParameter";
import searchQueryParamName from "../searchQueryParamName";
import { formatCurrentDate } from "../../../../utils/formatCurrentDate";

const TasksList = () => {
  const query = useQueryParameter(searchQueryParamName);
  const tasks = useSelector(state => selectTasksByQuery(state, query));
  const hideDone = useSelector(selectHideDone);
  const editedTask = useSelector(selectEditedTask)
  const dispatch = useDispatch();
  const date = formatCurrentDate(new Date());

  return (
    <List >
      {tasks.map((task, index) => (
        <Item
          key={task.id}
          hidden={task.done && hideDone}
          edit={editedTask?.id === task.id}
        >
          <ToggleButton
            onClick={() => dispatch(toggleTaskDone({ taskId: task.id, doneDate: task.done ? null : date }))}
            disabled={editedTask !== null}
          >
            {task.done ? "✔" : ""}
          </ToggleButton>
          <Content>
            {(!query) ? <span>{index + 1}. </span> : ""}
            <Task done={task.done}>
              <StyledLink to={`/zadania/${task.id}`}>{task.content}</StyledLink>
            </Task>
          </Content>
          <EditButton
            onClick={() => dispatch(editTask(task.id))}
            disabled={editedTask !== null}
          >
            ✏️
          </EditButton>
          <RemoveButton
            onClick={() => dispatch(removeTasks(task.id))}
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