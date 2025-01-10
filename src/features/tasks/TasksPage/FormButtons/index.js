import { useDispatch, useSelector } from "react-redux";
import { selectFetchStatus, fetchExampleTasks, selectAreTasksEmpty } from "../../tasksSlice";
import ButtonsContainer from "../../../../common/ButtonsContainer";
import Button from "../../../../common/Button";

const FormButtons = () => {
  const dispatch = useDispatch();
  const fetchStatus = useSelector(selectFetchStatus);
  const areTasksEmpty = useSelector(selectAreTasksEmpty);

  return (
    <ButtonsContainer>
      {areTasksEmpty && <Button
        onClick={() => dispatch(fetchExampleTasks())}
        disabled={fetchStatus === "loading" || fetchStatus === "error"}
        error={fetchStatus === "error"}
      >
        {fetchStatus === "ready" ? "Pobierz przykładowe zadania" :
          fetchStatus === "loading" ? "Ładowanie..." : "Błąd ładowania danych"}
      </Button>}
    </ButtonsContainer>
  )
};

export default FormButtons;