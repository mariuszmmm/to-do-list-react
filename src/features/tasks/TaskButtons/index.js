import Button from "../../../common/Button";
import ButtonsContainer from "../../../common/ButtonsContainer";
import { selectHideDone, selectIsEveryTaskDone, selectAreTasksEmpty, toggleHideDone, setAllDone } from "../tasksSlice";
import { useSelector, useDispatch } from "react-redux";

const TaskButtons = () => {
  const areTasksEmpty = useSelector(selectAreTasksEmpty);
  const hideDone = useSelector(selectHideDone);
  const isEveryTaskDone = useSelector(selectIsEveryTaskDone);

  const dispatch = useDispatch();

  return (
    <ButtonsContainer>
      {!areTasksEmpty && (
        <>
          <Button
            onClick={() => dispatch(toggleHideDone())}
          >
            {hideDone ? "Pokaż" : "Ukryj"} ukończone
          </Button>
          <Button
            onClick={() => dispatch(setAllDone())}
            disabled={isEveryTaskDone}
          >
            Ukończ wszystkie
          </Button>
        </>
      )}
    </ButtonsContainer>
  );
};

export default TaskButtons;