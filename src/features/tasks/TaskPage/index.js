import { useParams } from "react-router-dom";
import Container from "../../../common/Container";
import Header from "../../../common/Header";
import Section from "../../../common/Section";
import { useSelector } from "react-redux";
import { getTasksById } from "../tasksSlice";

const Task = () => {
  const { id } = useParams();
  const task = useSelector(state => getTasksById(state, id));

  return (
    <Container>
      <Header title="Szczegóły zadania" />
      <Section
        title={task ? task.content : "Nie znaleziono zadania 😥"}
        body={
          task ? <>
            <strong>Ukończone: </strong> {task.done ? "Tak" : "Nie"}
          </> : ""
        }
      />
    </Container>
  );
};

export default Task;