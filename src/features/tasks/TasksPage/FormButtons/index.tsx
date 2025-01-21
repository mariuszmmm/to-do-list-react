import {
  selectFetchStatus,
  fetchExampleTasks,
  selectAreTasksEmpty,
} from "../../tasksSlice";
import ButtonsContainer from "../../../../common/ButtonsContainer";
import Button from "../../../../common/Button";
import { useAppDispatch, useAppSelector } from "../../../../hooks";

const FormButtons = () => {
  const dispatch = useAppDispatch();
  const fetchStatus = useAppSelector(selectFetchStatus);
  const areTasksEmpty = useAppSelector(selectAreTasksEmpty);

  return (
    <>
      {areTasksEmpty && (
        <ButtonsContainer>
          <Button
            onClick={() => dispatch(fetchExampleTasks())}
            disabled={fetchStatus === "loading" || fetchStatus === "$error"}
            $error={fetchStatus === "$error"}
          >
            {fetchStatus === "ready"
              ? "Pobierz przykładowe zadania"
              : fetchStatus === "loading"
              ? "Ładowanie..."
              : "Błąd ładowania danych"}
          </Button>
        </ButtonsContainer>
      )}
    </>
  );
};

export default FormButtons;
