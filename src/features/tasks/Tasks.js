import Container from "../../common/Container";
import Header from "../../common/Header";
import Section from "../../common/Section";
import Form from "./Form";
import TasksList from "./TasksList";
import Buttons from "./Buttons";

const Tasks = () => {

   return (
      <Container>
         <Header title="Lista zadań" />
         <Section
            title="Dodaj nowe zadanie"
            body={<Form />}
         />
         <Section
            title="Lista zadań"
            body={<TasksList />}
            extraHeaderContent={<Buttons />}
         />
      </Container>
   );
};

export default Tasks;
