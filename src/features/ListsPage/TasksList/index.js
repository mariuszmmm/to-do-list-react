import { List, Item, Content, Task } from "./styled";
import { ToggleButton } from "../../../common/taskButtons";

const TasksList = ({ list }) => (
  <List>
    {list?.map((task, index) => (
      <Item
        key={task.id}
      >
        <ToggleButton disabled>
          {task.done ? "✔" : ""}
        </ToggleButton>
        <Content>
          {<span>{index + 1}. </span>}
          <Task>{task.content}</Task>
        </Content>
      </Item>
    ))}
  </List>
);

export default TasksList;