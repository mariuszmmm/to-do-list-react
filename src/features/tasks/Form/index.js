import { useState, useRef } from 'react'; import { useDispatch } from 'react-redux';
import { nanoid } from '@reduxjs/toolkit';
import { StyledForm, Input, Button } from "./styled";
import { addTask } from '../tasksSlice';


const Form = () => {
   const [newTaskContent, setNewTaskContent] = useState("");
   const inputRef = useRef(null);

   const dispatch = useDispatch();

   const onFormSubmit = (event) => {
      event.preventDefault();

      const trimmedNewTaskContent = newTaskContent.trim()

      if (trimmedNewTaskContent) {
         dispatch(addTask({
            content: trimmedNewTaskContent,
            done: false,
            id: nanoid(),

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