import { List, Item, Content, Task } from "./styled";
import { ToggleButton } from "../../../common/buttons";

const TasksList = ({ list }) => (
  <List>
    {list?.map((task, index) => (
      <Item
        key={task.id}
      >
        <ToggleButton disabled lists>
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