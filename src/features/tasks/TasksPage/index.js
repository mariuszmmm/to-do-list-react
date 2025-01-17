import Header from "../../../common/Header";
import Section from "../../../common/Section";
import FormButtons from "./FormButtons";
import Form from "./Form";
import Search from "./Search";
import TasksList from "./TasksList";
import TasksButtons from "./TasksButtons";
import SearchButtons from "./SearchButtons";
import { useSelector } from "react-redux";
import { selectEditedTask, selectShowSearch } from "../tasksSlice";
import { Name } from "./Name";

const TasksPage = () => {
  const showSearch = useSelector(selectShowSearch);
  const editedTask = useSelector(selectEditedTask);

  return (
    <>
      <Header title="Lista zadań" />
      <Section
        title={editedTask === null ? "Dodaj nowe zadanie" : "Edytuj zadanie"}
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
        title={< Name />}
        body={<TasksList />}
        extraHeaderContent={<TasksButtons />}
      />
    </>
  );
};

export default TasksPage;