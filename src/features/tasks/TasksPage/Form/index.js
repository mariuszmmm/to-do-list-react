import { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { addTask } from '../../tasksSlice';
import { nanoid } from '@reduxjs/toolkit';
import { StyledForm, Button } from "./styled";
import { Input } from "../../../../common/Input";
import { useReplaceQueryParameter } from '../queryParameter';
import searchQueryParamName from '../searchQueryParamName';
import { formatCurrentDate } from '../../../../utils/formatCurrentDate';

const Form = () => {
  const [newTaskContent, setNewTaskContent] = useState("");
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const replaceQueryParameter = useReplaceQueryParameter();
  const formatedDate = formatCurrentDate(new Date());

  const onFormSubmit = (event) => {
    event.preventDefault();

    replaceQueryParameter({
      key: searchQueryParamName,
    });

    const trimmedNewTaskContent = newTaskContent.trim();

    if (trimmedNewTaskContent) {
      dispatch(addTask({
        content: trimmedNewTaskContent,
        done: false,
        id: nanoid(),
        date: formatedDate,
      }));
    };

    setNewTaskContent("");
    inputRef.current.focus();
  };

  return (
    <StyledForm onSubmit={onFormSubmit}>
      <Input
        autoFocus
        value={newTaskContent}
        name="taskName"
        placeholder="Co jest do zrobienia ?"
        onChange={({ target }) => setNewTaskContent(target.value)}
        ref={inputRef}
      />
      <Button>
        Dodaj zadanie
      </Button>
    </StyledForm>
  )
};

export default Form;