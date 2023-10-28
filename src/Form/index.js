import { useState, useRef } from 'react';
import { StyledForm, Input, Button } from "./styled";

const Form = ({ addNewTask }) => {
   const [newTaskContent, setNewTaskContent] = useState("");
   const inputRef = useRef(null);

   const onFormSubmit = (event) => {
      event.preventDefault();

      const trimmedNewTaskContent = newTaskContent.trim()

      if (trimmedNewTaskContent) {
         addNewTask(trimmedNewTaskContent);
      }

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