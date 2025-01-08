import { useDispatch, useSelector } from "react-redux";
import { selectFetchStatus, fetchExampleTasks, selectTasks } from "../../tasksSlice";
import ButtonsContainer from "../../../../common/ButtonsContainer";
import Button from "../../../../common/Button";

const FormButtons = () => {
  const dispatch = useDispatch();
  const fetchStatus = useSelector(selectFetchStatus);
  const tasks = useSelector(selectTasks);

  return (
    <ButtonsContainer>
      <Button
        onClick={() => dispatch(fetchExampleTasks())}
        disabled={fetchStatus === "loading" || fetchStatus === "error" || tasks.length > 0}
        error={fetchStatus === "error"}
      >
        {fetchStatus === "ready" ? "Pobierz przykładowe zadania" :
          fetchStatus === "loading" ? "Ładowanie..." : "Błąd ładowania danych"}
      </Button>
    </ButtonsContainer>
  )
};

export default FormButtons;