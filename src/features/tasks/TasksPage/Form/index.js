import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTask, editTask, saveEditedTask, selectEditedTask, selectTasks } from '../../tasksSlice';
import { nanoid } from '@reduxjs/toolkit';
import { StyledForm, Button } from "./styled";
import { Input } from "../../../../common/Input";
import { useReplaceQueryParameter } from '../queryParameter';
import searchQueryParamName from '../searchQueryParamName';
import { formatCurrentDate } from '../../../../utils/formatCurrentDate';

const Form = () => {
  const tasks = useSelector(selectTasks);
  const editedTask = useSelector(selectEditedTask)
  const [taskContent, setTaskContent] = useState("");
  const [previousContent, setPreviousContent] = useState("");
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const replaceQueryParameter = useReplaceQueryParameter();
  const formatedDate = formatCurrentDate(new Date());

  const onFormSubmit = (event) => {
    event.preventDefault();

    editedTask === null && replaceQueryParameter({
      key: searchQueryParamName,
    });

    const trimmedTaskContent = taskContent.trim();

    if (trimmedTaskContent) {
      editedTask === null
        ?
        dispatch(addTask({
          task: {
            content: trimmedTaskContent,
            done: false,
            id: nanoid(),
            date: formatedDate,
          },
          lastTasks: tasks
        }
        ))
        :
        trimmedTaskContent !== previousContent
          ?
          dispatch(saveEditedTask({
            task: {
              id: editedTask.id,
              content: trimmedTaskContent,
              editedDate: formatedDate,
            },
            lastTasks: tasks
          }
          ))
          :
          dispatch(editTask())
    };

    setTaskContent("");
    editedTask === null && inputRef.current.focus();
    inputRef.current.scrollLeft = inputRef.current.scrollWidth;
  };

  useEffect(() => {
    if (editedTask !== null) {
      setTaskContent(editedTask.content);
      setPreviousContent(editedTask.content);
      inputRef.current.focus();
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
      <Button>
        {editedTask !== null ? "Zapisz zmiany" : "Dodaj zadanie"}
      </Button>
    </StyledForm>
  )
};

export default Form;