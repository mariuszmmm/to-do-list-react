// import { ToggleButton } from "../taskButtons";
import { Task } from "../../types";
import {
  StyledListContent,
  StyledList,
  StyledListItem,
  StyledSpan,
  TaskNumber,
} from "../StyledList";

interface TasksListViewProps {
  tasks: Task[];
}

export const TasksListView = ({ tasks }: TasksListViewProps) => (
  <StyledList>
    {tasks?.map((task, index) => (
      <StyledListItem key={task.id} $type={"tasks"}>
  {/* <ToggleButton disabled>{task.done ? "✔" : ""}</ToggleButton> */}
        <StyledListContent $type={"tasks"}>
          <TaskNumber>{`${index + 1}. `}</TaskNumber>
          <StyledSpan $done={task.done} $noLink>
            {task.content}
          </StyledSpan>
        </StyledListContent>
      </StyledListItem>
    ))}
  </StyledList>
);
