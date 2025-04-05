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
import { useTranslation } from "react-i18next";

const TasksPage = () => {
  const showSearch = useAppSelector(selectShowSearch);
  const editedTask = useAppSelector(selectEditedTask);
  const { t } = useTranslation("translation", {
    keyPrefix: "tasksPage",
  });

  return (
    <>
      <Header title={t("title")} />
      <Section
        title={
          editedTask === null
            ? t("form.title.addTask")
            : t("form.title.editTask")
        }
        extraHeaderContent={<TaskFormButtons />}
        body={<TaskForm />}
      />
      <Section
        title={t("search.title")}
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
