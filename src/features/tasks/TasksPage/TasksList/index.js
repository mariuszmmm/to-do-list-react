import { useSelector, useDispatch } from "react-redux";
import { selectHideDone, toggleTaskDone, removeTasks, selectTasksByQuery } from "../../tasksSlice";
import { List, Item, ToggleButton, Content, Task, RemoveButton, StyledLink } from "./styled";
import { useQueryParameter } from "../queryParameter";
import searchQueryParamName from "../searchQueryParamName";

const TasksList = () => {
  const query = useQueryParameter(searchQueryParamName);
  const tasks = useSelector(state => selectTasksByQuery(state, query));
  const hideDone = useSelector(selectHideDone);

  const dispatch = useDispatch();

  return (
    <List>
      {tasks.map((task, index) => (
        <Item
          key={task.id}
          hidden={task.done && hideDone}
        >
          <ToggleButton
            onClick={() => dispatch(toggleTaskDone(task.id))}
          >
            {task.done ? "✔" : ""}
          </ToggleButton>
          <Content>
            {(!query) ? <span>{index + 1}. </span> : ""}
            <Task done={task.done}>
              <StyledLink to={`/zadania/${task.id}`}>{task.content}</StyledLink>
            </Task>
          </Content>
          <RemoveButton
            onClick={() => dispatch(removeTasks(task.id))}
          >
            🗑︎
          </RemoveButton>
        </Item>
      ))}
    </List>
  );
};

export default TasksList;