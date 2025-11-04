import { ToggleButton } from "../taskButtons";
import { Task } from "../../types";
import {
  StyledListContent,
  StyledList,
  StyledListItem,
  StyledTask,
  TaskNumber,
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
          <TaskNumber>{`${index + 1}. `}</TaskNumber>
          <StyledTask $done={task.done} $noLink>
            {task.content}
          </StyledTask>
        </StyledListContent>
      </StyledListItem>
    ))}
  </StyledList>
);
