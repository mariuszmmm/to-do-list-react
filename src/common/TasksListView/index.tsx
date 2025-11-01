import { ToggleButton } from "../taskButtons";
import { Task } from "../../types";
import {
  StyledListContent,
  StyledList,
  StyledListItem,
  StyledTask,
} from "../StyledList";

interface TasksListViewProps {
  tasks: Task[];
}

export const TasksListView = ({ tasks }: TasksListViewProps) => (
  <StyledList>
    {tasks?.map((task, index) => (
      <StyledListItem key={task.id} $type={"tasks"}>
        <ToggleButton disabled>{task.done ? "✔" : ""}</ToggleButton>
        <StyledListContent $type={"tasks"}>
          {
            <span>
              <b>{index + 1}. </b>
            </span>
          }
          <StyledTask $done={task.done}>{task.content}</StyledTask>
        </StyledListContent>
      </StyledListItem>
    ))}
  </StyledList>
);
