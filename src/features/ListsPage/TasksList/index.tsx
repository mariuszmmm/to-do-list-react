import { Item, Content } from "./styled";
import { ToggleButton } from "../../../common/taskButtons";
import { List } from "../../../types";
import { Task } from "../../../common/Task";
import { StyledList } from "../../../common/StyledList";

export const TasksList = ({ list }: { list: List["taskList"] }) => (
  <StyledList>
    {list?.map((task, index) => (
      <Item key={task.id}>
        <ToggleButton disabled>{task.done ? "✔" : ""}</ToggleButton>
        <Content>
          {<span><b>{index + 1}. </b></span>}
          <Task $done={task.done}>{task.content}</Task>
        </Content>
      </Item>
    ))}
  </StyledList>
);
