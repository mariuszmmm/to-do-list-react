import { useState, useRef, useEffect, FormEventHandler } from "react";
import {
  addTask,
  setTaskToEdit,
  saveEditedTask,
  selectEditedTask,
  selectTasks,
  selectListName,
} from "../../tasksSlice";
import { nanoid } from "@reduxjs/toolkit";
import { StyledForm, Button } from "./styled";
import { Input } from "../../../../common/Input";
import { useReplaceQueryParameter } from "../../../../utils/queryParameter";
import searchQueryParamName from "../../../../utils/searchQueryParamName";
import { formatCurrentDate } from "../../../../utils/formatCurrentDate";
import { useAppDispatch, useAppSelector } from "../../../../hooks";

const Form = () => {
  const tasks = useAppSelector(selectTasks);
  const listName = useAppSelector(selectListName);
  const editedTask = useAppSelector(selectEditedTask);
  const [taskContent, setTaskContent] = useState("");
  const [previousContent, setPreviousContent] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const replaceQueryParameter = useReplaceQueryParameter();
  const formatedDate = formatCurrentDate(new Date());

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
    <StyledForm onSubmit={onFormSubmit}>
      <Input
        autoFocus
        value={taskContent}
        name="taskName"
        placeholder="Co jest do zrobienia ?"
        onChange={({ target }) => setTaskContent(target.value)}
        ref={inputRef}
      />
      <Button>{editedTask !== null ? "Zapisz zmiany" : "Dodaj zadanie"}</Button>
    </StyledForm>
  );
};

export default Form;
