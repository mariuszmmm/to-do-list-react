import { useParams } from "react-router-dom";
import { selectTaskById } from "../tasksSlice";
import Header from "../../../common/Header";
import Section from "../../../common/Section";
import { DateInfo, Name } from "./styled";
import { useAppSelector } from "../../../hooks/hooks";

const TaskPage = () => {
  const { id } = useParams();
  const task = useAppSelector((state) =>
    id ? selectTaskById(state, id) : null
  );

  return (
    <>
      <Header title="Szczegóły zadania" />
      <Section
        title={task ? task.content : "Nie znaleziono zadania 😥"}
        body={
          task && (
            <>
              <DateInfo>
                <Name>Ukończone: </Name> {task.done ? "Tak" : "Nie"}
              </DateInfo>
              <DateInfo>
                <Name>Data utworzenia: </Name> {task.date}
              </DateInfo>
              {task.editedDate && (
                <DateInfo>
                  <Name>Data modyfikacji: </Name> {task.editedDate}
                </DateInfo>
              )}
              {task.done && task.doneDate && (
                <DateInfo>
                  <Name>Data ukończenia: </Name> {task.doneDate}
                </DateInfo>
              )}
            </>
          )
        }
      />
    </>
  );
};

export default TaskPage;
