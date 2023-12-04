import { useSelector } from "react-redux";
import { useLocalStorageState } from "../../useLocalStorageState";
import Form from "./Form";
import TasksList from "./TasksList";
import Buttons from "./Buttons";
import Section from "../../common/Section";
import Header from "../../common/Header";
import Container from "../../common/Container";
import { useTasks } from "../../useTasks";
import { selectTasks } from "./tasksSlice";


function Tasks() {
   const { tasks } = useSelector(selectTasks);

   const {
      removeTasks,
      toggleTaskDone,
      setAllDone,
      addNewTask,
   } = useTasks();

   return (
      <Container>
         <Header title="Lista zadań" />
         <Section
            title="Dodaj nowe zadanie"
            body={<Form addNewTask={addNewTask} />}
         />
         <Section
            title="Lista zadań"
            body={
               <TasksList
                  removeTasks={removeTasks}
                  toggleTaskDone={toggleTaskDone}
               />
            }
            extraHeaderContent={
               <Buttons
                  setAllDone={setAllDone}
               />
            }
         />
      </Container>
   );
}

export default Tasks;