import { useSelector, useDispatch } from "react-redux";
import ButtonsContainer from "../../../../common/ButtonsContainer";
import Button from "../../../../common/Button";
import {
  selectAreTasksEmpty,
  selectHideDone,
  selectIsEveryTaskDone,
  toggleHideDone,
  setAllDone,
  restoreDeletedTask,
  selectAreDeletedTasksEmpty
} from "../../tasksSlice";

const TaskButtons = () => {
  const areTasksEmpty = useSelector(selectAreTasksEmpty);
  const hideDone = useSelector(selectHideDone);
  const isEveryTaskDone = useSelector(selectIsEveryTaskDone);
  const dispatch = useDispatch();
  const areDeletedTasksEmpty = useSelector(selectAreDeletedTasksEmpty);

  return (
    <ButtonsContainer>
      {(!areTasksEmpty || !areDeletedTasksEmpty) && (
        <>
          <Button
            onClick={() => dispatch(toggleHideDone())}
            disabled={areTasksEmpty}
          >
            {hideDone ? "Pokaż" : "Ukryj"} ukończone
          </Button>
          <Button
            onClick={() => dispatch(setAllDone())}
            disabled={isEveryTaskDone}
          >
            Ukończ wszystkie
          </Button>
          <Button
            onClick={() => dispatch(restoreDeletedTask())}
            disabled={areDeletedTasksEmpty}
          >
            Przywróc usunięte
          </Button>
        </>
      )}
    </ButtonsContainer>
  );
};

export default TaskButtons;