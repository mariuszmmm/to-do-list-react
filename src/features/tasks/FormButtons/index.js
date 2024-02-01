import { useDispatch, useSelector } from "react-redux";
import Button from "../../../common/Button";
import ButtonsContainer from "../../../common/ButtonsContainer"
import { fetchExampleTasks, selectFetchWorking } from "../tasksSlice";

const FormButtons = () => {
  const dispatch = useDispatch();
  const fetchWorking = useSelector(selectFetchWorking);

  return (
    <ButtonsContainer>
      <Button
        onClick={() => dispatch(fetchExampleTasks())}
        disabled={fetchWorking}>
        {fetchWorking ? "Ładowanie..." : "Pobierz przykładowe zadania"}
      </Button>
    </ButtonsContainer>
  )
};

export default FormButtons;