import { useState, useRef } from 'react';
import "./style.css";

const Form = ({ addNewTask }) => {
    const [newTaskContent, setNewTaskContent] = useState("");
    const inputRef = useRef(null);

    const focusInput = () => {
        inputRef.current.focus();
    };

    const onFormSubmit = (event) => {
        event.preventDefault();

        const trimmedNewTaskContent = newTaskContent.trim()

        if (!trimmedNewTaskContent) {
            setNewTaskContent("");
            return;
        }

        addNewTask(trimmedNewTaskContent);
        setNewTaskContent("");
    };

    return (
        <form className="form" onSubmit={onFormSubmit}>
            <input
                autoFocus
                value={newTaskContent}
                className="form__input"
                name="taskName"
                placeholder="Co jest do zrobienia ?"
                onChange={({ target }) => setNewTaskContent(target.value)}
                ref={inputRef}
            />
            <button className="form__button" onClick={focusInput}>
                Dodaj zadanie
            </button>
        </form>
    )
};

export default Form;