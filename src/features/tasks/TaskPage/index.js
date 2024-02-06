import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectTaskById } from "../tasksSlice";
import Header from "../../../common/Header";
import Section from "../../../common/Section";

const TaskPage = () => {
  const { id } = useParams();
  const task = useSelector(state => selectTaskById(state, id));

  return (
    <>
      <Header title="Szczegóły zadania" />
      <Section
        title={task ? task.content : "Nie znaleziono zadania 😥"}
        body={
          task ? <>
            <strong>Ukończone: </strong> {task.done ? "Tak" : "Nie"}
          </> : ""
        }
      />
    </>
  );
};

export default TaskPage;