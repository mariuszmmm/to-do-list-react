import Container from "../../../common/Container";
import Header from "../../../common/Header";
import Section from "../../../common/Section";
import Form from "./Form";
import TasksList from "./TasksList";
import TaskButtons from "./TasksButtons";
import FormButtons from "./FormButtons";

const Tasks = () => {

  return (
    <Container>
      <Header title="Lista zadań" />
      <Section
        title="Dodaj nowe zadanie"
        extraHeaderContent={<FormButtons />}
        body={<Form />}
      />
      <Section
        title="Lista zadań"
        body={<TasksList />}
        extraHeaderContent={<TaskButtons />}
      />
    </Container>
  );
};

export default Tasks;