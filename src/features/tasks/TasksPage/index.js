import Header from "../../../common/Header";
import Section from "../../../common/Section";
import FormButtons from "./FormButtons";
import Form from "./Form";
import Search from "./Search";
import TasksList from "./TasksList";
import TaskButtons from "./TasksButtons";
import SearchButtons from "./SearchButtons";
import { useSelector } from "react-redux";
import { selectShowSearch } from "../tasksSlice";

const TasksPage = () => {
  const showSearch = useSelector(selectShowSearch);

  return (
    <>
      <Header title="Lista zadań" />
      <Section
        title="Dodaj nowe zadanie"
        extraHeaderContent={<FormButtons />}
        body={<Form />}
      />
      <Section
        title="Wyszukiwarka"
        body={<Search />}
        extraHeaderContent={<SearchButtons />}
        hidden={!showSearch}
      />
      <Section
        title="Lista zadań"
        body={<TasksList />}
        extraHeaderContent={<TaskButtons />}
      />
    </>
  );
};

export default TasksPage;