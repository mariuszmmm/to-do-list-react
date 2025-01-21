import { StyledList, Item, Content, Task } from "./styled";
import { ToggleButton } from "../../../common/taskButtons";
import { List } from "../../../types";

const TasksList = ({ list }: { list: List["taskList"] }) => (
  <StyledList>
    {list?.map((task, index) => (
      <Item key={task.id}>
        <ToggleButton disabled>{task.done ? "✔" : ""}</ToggleButton>
        <Content>
          {<span>{index + 1}. </span>}
          <Task>{task.content}</Task>
        </Content>
      </Item>
    ))}
  </StyledList>
);

export default TasksList;
