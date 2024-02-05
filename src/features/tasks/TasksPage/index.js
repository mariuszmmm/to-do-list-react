import Container from "../../../common/Container";
import Header from "../../../common/Header";
import Section from "../../../common/Section";
import FormButtons from "./FormButtons";
import Form from "./Form";
import Search from "./Search";
import TasksList from "./TasksList";
import TaskButtons from "./TasksButtons";

const TasksPage = () => {

  return (
    <Container>
      <Header title="Lista zadań" />
      <Section
        title="Dodaj nowe zadanie"
        extraHeaderContent={<FormButtons />}
        body={<Form />}
      />
      <Section
        title="Wyszukiwarka"
        body={<Search />}
      />
      <Section
        title="Lista zadań"
        body={<TasksList />}
        extraHeaderContent={<TaskButtons />}
      />
    </Container>
  );
};

export default TasksPage;