import { useLocalStorageState } from "../../useLocalStorageState";
import Form from "./Form";
import TasksList from "./TasksList";
import Buttons from "./Buttons";
import Section from "../../common/Section";
import Header from "../../common/Header";
import Container from "../../common/Container";
import { useTasks } from "../../useTasks";

function Tasks() {
   const [hideDone, setHideDone] = useLocalStorageState("hideDone", false);

   const togglehideDone = () => {
      setHideDone(hideDone => !hideDone);
   };

   const {
      tasks,
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
                  tasks={tasks}
                  hideDone={hideDone}
                  removeTasks={removeTasks}
                  toggleTaskDone={toggleTaskDone}
               />
            }
            extraHeaderContent={
               <Buttons
                  tasks={tasks}
                  hideDone={hideDone}
                  togglehideDone={togglehideDone}
                  setAllDone={setAllDone}
               />
            }
         />
      </Container>
   );
}

export default Tasks;
