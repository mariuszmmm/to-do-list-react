import { useDispatch, useSelector } from "react-redux";
import Button from "../../../common/Button";
import ButtonsContainer from "../../../common/ButtonsContainer"
import { fetchExampleTasks, selectFetchStatus } from "../tasksSlice";

const FormButtons = () => {
  const dispatch = useDispatch();
  const fetchStatus = useSelector(selectFetchStatus);

  return (
    <ButtonsContainer>
      <Button
        onClick={() => dispatch(fetchExampleTasks())}
        disabled={fetchStatus === "working" || fetchStatus === "error"}
        error={fetchStatus === "error"}
      >
        {fetchStatus === "ready" ? "Pobierz przykładowe zadania" :
          fetchStatus === "working" ? "Ładowanie..." : "Błąd ładowania danych"}
      </Button>
    </ButtonsContainer>
  )
};

export default FormButtons;