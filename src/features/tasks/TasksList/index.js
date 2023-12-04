import { selectTasks } from "../tasksSlice";
import { List, Item, ToggleButton, RemoveButton, Content, Text } from "./styled";
import { useSelector } from "react-redux";

const TasksList = ({ removeTasks, toggleTaskDone }) => {
   const { tasks, hideDone } = useSelector(selectTasks);

   return (
      <List>
         {tasks.map(task => (
            <Item
               key={task.id}
               hidden={task.done && hideDone}
            >
               <ToggleButton
                  onClick={() => toggleTaskDone(task.id)}
               >
                  {task.done ? "✔" : ""}
               </ToggleButton>
               <Content>
                  {task.id}.{" "}
                  <Text done={task.done}>
                     &nbsp;{task.content}&nbsp;
                  </Text>
               </Content>
               <RemoveButton
                  onClick={() => removeTasks(task.id)}
               >
                  🗑︎
               </RemoveButton>
            </Item>
         ))}
      </List>
   );
};

export default TasksList;