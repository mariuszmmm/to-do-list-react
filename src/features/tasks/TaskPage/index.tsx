import { useParams } from "react-router-dom";
import { useAppSelector } from "../../../hooks";
import { DateInfo, Name } from "./styled";
import { Header } from "../../../common/Header";
import { Section } from "../../../common/Section";
import { selectTaskById } from "../tasksSlice";
import { formatCurrentDate } from "../../../utils/formatCurrentDate";
import { useTranslation } from "react-i18next";

const TaskPage = () => {
  const { id } = useParams();
  const task = useAppSelector((state) =>
    id ? selectTaskById(state, id) : null
  );
  const { i18n } = useTranslation();

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
                <Name>Data utworzenia: </Name>{" "}
                {formatCurrentDate(new Date(task.date), i18n.language)}
              </DateInfo>
              {task.editedDate && (
                <DateInfo>
                  <Name>Data modyfikacji: </Name>{" "}
                  {formatCurrentDate(new Date(task.editedDate), i18n.language)}
                </DateInfo>
              )}
              {task.done && task.doneDate && (
                <DateInfo>
                  <Name>Data ukończenia: </Name>
                  {formatCurrentDate(new Date(task.doneDate), i18n.language)}
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
