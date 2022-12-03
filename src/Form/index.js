import "./style.css";

const Form = () => (
    <form className="form">
        <input autoFocus className="form__input" name="taskName"
            placeholder="Co jest do zrobienia ?" />
        <button className="form__button">Dodaj zadanie</button>
    </form>
);

export default Form;