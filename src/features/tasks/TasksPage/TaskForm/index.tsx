import { useState, useRef, useEffect, FormEventHandler } from "react";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { useReplaceQueryParameter } from "../../../../hooks/useReplaceQueryParameter";
import { nanoid } from "@reduxjs/toolkit";
import { Input } from "../../../../common/Input";
import { Form } from "../../../../common/Form";
import { FormButton } from "../../../../common/FormButton";
import searchQueryParamName from "../../../../utils/searchQueryParamName";
import {
  addTask,
  setTaskToEdit,
  saveEditedTask,
  selectEditedTask,
  selectTasks,
  selectListName,
} from "../../tasksSlice";
import { useTranslation } from "react-i18next";
import { getWidthForFormTasksButton } from "../../../../utils/getWidthForDynamicButtons";

export const TaskForm = () => {
  const tasks = useAppSelector(selectTasks);
  const listName = useAppSelector(selectListName);
  const editedTask = useAppSelector(selectEditedTask);
  const [taskContent, setTaskContent] = useState("");
  const [previousContent, setPreviousContent] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const replaceQueryParameter = useReplaceQueryParameter();
  const { t, i18n } = useTranslation("translation", {
    keyPrefix: "tasksPage",
  });
  const formatedDate = new Date().toISOString();

  const onFormSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    editedTask === null &&
      replaceQueryParameter({
        key: searchQueryParamName,
      });

    const trimmedTaskContent = taskContent.trim();

    if (trimmedTaskContent) {
      editedTask === null
        ? dispatch(
            addTask({
              task: {
                id: nanoid(),
                content: trimmedTaskContent,
                done: false,
                date: formatedDate,
              },
              stateForUndo: { tasks, listName },
            })
          )
        : trimmedTaskContent !== previousContent
        ? dispatch(
            saveEditedTask({
              task: {
                id: editedTask.id,
                content: trimmedTaskContent,
                done: editedTask.done,
                date: editedTask.date,
                editedDate: formatedDate,
              },
              stateForUndo: { tasks, listName },
            })
          )
        : dispatch(setTaskToEdit());
    }

    setTaskContent("");
    editedTask === null && inputRef.current!.focus();
    inputRef.current!.scrollLeft = inputRef.current!.scrollWidth;
  };

  useEffect(() => {
    if (editedTask !== null) {
      setTaskContent(editedTask.content);
      setPreviousContent(editedTask.content);
      inputRef.current!.focus();
    }
  }, [editedTask]);

  return (
    <Form onSubmit={onFormSubmit} $singleInput>
      <Input
        value={taskContent}
        name="taskName"
        placeholder={t("form.inputPlaceholder")}
        onChange={({ target }) => setTaskContent(target.value)}
        ref={inputRef}
      />
      <FormButton
        $singleInput
        width={getWidthForFormTasksButton(i18n.language)}
      >
        {editedTask !== null
          ? t("form.inputButton.saveChanges")
          : t("form.inputButton.addTask")}
      </FormButton>
    </Form>
  );
};
