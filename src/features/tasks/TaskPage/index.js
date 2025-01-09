import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectTaskById } from "../tasksSlice";
import Header from "../../../common/Header";
import Section from "../../../common/Section";
import { DateInfo, Name } from "./styled";

const TaskPage = () => {
  const { id } = useParams();
  const task = useSelector(state => selectTaskById(state, id));

  return (
    <>
      <Header title="Szczegóły zadania" />
      <Section
        title={task ? task.content : "Nie znaleziono zadania 😥"}
        body={
          task && <>
            <DateInfo>
              <Name>Ukończone: </Name> {task.done ? "Tak" : "Nie"}
            </DateInfo>
            <DateInfo>
              <Name>Data utworzenia: </Name> {task.date}
            </DateInfo>
            {task.editedDate && <DateInfo>
              <Name>Data modyfikacji: </Name> {task.editedDate}
            </DateInfo>}
            {task.done && <DateInfo>
              <Name>Data ukończenia: </Name> {task.doneDate}
            </DateInfo>}
          </>
        }
      />
    </>
  );
};

export default TaskPage;