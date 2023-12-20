import { List, Item, ToggleButton, Content, Text, RemoveButton } from "./styled";
import { toggleTaskDone, removeTasks, selectTasksState } from "../tasksSlice";
import { useSelector, useDispatch } from "react-redux";

const TasksList = () => {
   const { tasks, hideDone } = useSelector(selectTasksState);
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
                  {index + 1}.{" "}
                  <Text done={task.done}>
                     &nbsp;{task.content}&nbsp;
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