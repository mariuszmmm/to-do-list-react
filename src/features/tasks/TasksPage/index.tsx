import { useAppSelector } from "../../../hooks";
import { TaskFormButtons } from "./TaskFormButtons";
import { Search } from "./Search";
import { TasksList } from "./TasksList";
import { TasksButtons } from "./TasksButtons";
import { SearchButtons } from "./SearchButtons";
import { EditableListName } from "./EditableListName";
import { Header } from "../../../common/Header";
import { Section } from "../../../common/Section";
import { TaskForm } from "./TaskForm";
import { selectEditedTask, selectShowSearch } from "../tasksSlice";

const TasksPage = () => {
  const showSearch = useAppSelector(selectShowSearch);
  const editedTask = useAppSelector(selectEditedTask);

  return (
    <>
      <Header title="Lista zadań" />
      <Section
        title={editedTask === null ? "Dodaj nowe zadanie" : "Edytuj zadanie"}
        extraHeaderContent={<TaskFormButtons />}
        body={<TaskForm />}
      />
      <Section
        title="Wyszukiwarka"
        body={showSearch && <Search />}
        extraHeaderContent={<SearchButtons />}
        bodyHidden={!showSearch}
      />
      <Section
        title={<EditableListName />}
        body={<TasksList />}
        extraHeaderContent={<TasksButtons />}
      />
    </>
  );
};

export default TasksPage;
