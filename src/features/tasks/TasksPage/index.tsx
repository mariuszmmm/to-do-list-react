import { useEffect } from "react";
import { useAppSelector } from "../../../hooks/redux";
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
import { ListsData, List } from "../../../types";
import { UseMutationResult } from "@tanstack/react-query";

type Props = {
  listsData?: ListsData;
  saveListMutation: UseMutationResult<{ data: ListsData }, Error, { list: List, deviceId: string }, unknown>;
};

const TasksPage = ({ listsData, saveListMutation }: Props) => {
  const showSearch = useAppSelector(selectShowSearch);
  const editedTaskContent = useAppSelector(selectEditedTask);
  const { t } = useTranslation("translation", {
    keyPrefix: "tasksPage",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Header title={t("title")} />
      <Section
        title={
          !editedTaskContent
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
        extraHeaderContent={
          <TasksButtons
            listsData={listsData}
            saveListMutation={saveListMutation}
          />
        }
      />
    </>
  );
};

export default TasksPage;
