import { useEffect } from "react";
import { useAppSelector } from "../../../hooks/redux/redux";
import { AddTasksButtons } from "./AddTasksButtons";
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
import { useTaskForm } from "./hooks/useTaskForm";

type Props = {
  listsData?: ListsData;
  saveListMutation: UseMutationResult<{ data: ListsData }, Error, { list: List; deviceId: string }, unknown>;
};

const TasksPage = ({ listsData, saveListMutation }: Props) => {
  const showSearch = useAppSelector(selectShowSearch);
  const editedTaskContent = useAppSelector(selectEditedTask);
  const { t } = useTranslation("translation", {
    keyPrefix: "tasksPage",
  });
  const taskForm = useTaskForm();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!editedTaskContent) return;
    window.scrollTo(0, 0);
  }, [editedTaskContent]);

  return (
    <>
      <Header title={t("title")} />
      <Section
        title={!editedTaskContent ? t("form.title.addTask") : t("form.title.editTask")}
        extraHeaderContent={<AddTasksButtons />}
        body={<TaskForm taskForm={taskForm} />}
      />
      <Section
        title={t("search.title")}
        body={<Search />}
        extraHeaderContent={<SearchButtons />}
        bodyHidden={!showSearch}
      />
      <Section
        taskList
        title={<EditableListName />}
        body={<TasksList taskForm={taskForm} />}
        extraHeaderContent={<TasksButtons listsData={listsData} saveListMutation={saveListMutation} />}
      />
    </>
  );
};

export default TasksPage;
