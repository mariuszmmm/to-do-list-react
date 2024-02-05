import { useSelector, useDispatch } from "react-redux";
import { selectTasks, selectHideDone, toggleTaskDone, removeTasks } from "../../tasksSlice";
import { List, Item, ToggleButton, Content, Text, RemoveButton, StyledLink } from "./styled";
import { useQueryParameter } from "../queryParameter";
import searchQueryParamName from "../searchQueryParamName";

const TasksList = () => {
  const tasks = useSelector(selectTasks);
  const hideDone = useSelector(selectHideDone);
  const dispatch = useDispatch();
  const query = useQueryParameter(searchQueryParamName);

  const tasksSearchParams =
    (!query || query === "") ? tasks : tasks.filter((task) =>
      ((task.content).toUpperCase()).includes(query.toUpperCase().trim()));

  return (
    <List>
      {tasksSearchParams.map((task, index) => (
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
            {(!query || query === "") ? `${index + 1}. ` : ""}
            <Text done={task.done}>
              <StyledLink to={`/zadania/${task.id}`}>{task.content}</StyledLink>
            </Text>
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