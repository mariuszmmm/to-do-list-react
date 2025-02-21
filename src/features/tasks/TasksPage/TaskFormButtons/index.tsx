import { useAppDispatch, useAppSelector } from "../../../../hooks";
import { ButtonsContainer } from "../../../../common/ButtonsContainer";
import { Button } from "../../../../common/Button";
import {
  selectFetchStatus,
  fetchExampleTasks,
  selectAreTasksEmpty,
} from "../../tasksSlice";

export const TaskFormButtons = () => {
  const dispatch = useAppDispatch();
  const fetchStatus = useAppSelector(selectFetchStatus);
  const areTasksEmpty = useAppSelector(selectAreTasksEmpty);

  return (
    <ButtonsContainer>
      <Button
        onClick={() => dispatch(fetchExampleTasks())}
        disabled={
          fetchStatus === "loading" || fetchStatus === "error" || !areTasksEmpty
        }
        $error={fetchStatus === "error"}
      >
        {fetchStatus === "ready"
          ? "Pobierz przykładowe zadania"
          : fetchStatus === "loading"
          ? "Ładowanie..."
          : "Błąd ładowania danych"}
      </Button>
    </ButtonsContainer>
  );
};
