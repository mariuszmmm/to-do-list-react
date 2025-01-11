import { useSelector, useDispatch } from "react-redux";
import ButtonsContainer from "../../../../common/ButtonsContainer";
import Button from "../../../../common/Button";
import {
  selectAreTasksEmpty,
  selectHideDone,
  selectIsEveryTaskDone,
  toggleHideDone,
  setAllDone,
  selectUndoStack,
  selectRedoStack,
  undo,
  redo,
  selectTasks,
  selectEditedTask,
  setAllUndone,
  selectIsEveryTaskUndone,
} from "../../tasksSlice";
import { Redo, Undo } from "./styled";

const TaskButtons = () => {
  const areTasksEmpty = useSelector(selectAreTasksEmpty);
  const hideDone = useSelector(selectHideDone);
  const isEveryTaskDone = useSelector(selectIsEveryTaskDone);
  const isEveryTaskUndone = useSelector(selectIsEveryTaskUndone);
  const undoStack = useSelector(selectUndoStack);
  const redoStack = useSelector(selectRedoStack);
  const tasks = useSelector(selectTasks);
  const editedTask = useSelector(selectEditedTask);
  const dispatch = useDispatch();

  return (
    <ButtonsContainer>
      <>
        <Button
          onClick={() => dispatch(toggleHideDone())}
          disabled={areTasksEmpty}
          noDisplay={areTasksEmpty}
        >
          {hideDone ? "Pokaż" : "Ukryj"} ukończone
        </Button>
        <Button
          onClick={() => dispatch(setAllDone({ lastTasks: tasks }))}
          disabled={isEveryTaskDone}
          noDisplay={areTasksEmpty}
        >
          Ukończ wszystkie
        </Button>
        <Button
          onClick={() => dispatch(setAllUndone({ lastTasks: tasks }))}
          disabled={isEveryTaskUndone}
          noDisplay={areTasksEmpty}
        >
          Odznacz wszystkie
        </Button>
        <ButtonsContainer>
          <Button
            disabled={undoStack.length === 0 || editedTask !== null}
            onClick={() => dispatch(undo())}
            title={(undoStack.length === 0 || editedTask !== null) ? "" : "Cofnij"}
          >
            <Undo />
          </Button>
          <Button
            disabled={redoStack.length === 0 || editedTask !== null}
            onClick={() => dispatch(redo())}
            title={(redoStack.length === 0 || editedTask !== null) ? "" : "Ponów"}
          >
            <Redo />
          </Button>
        </ButtonsContainer>
      </>
    </ButtonsContainer>
  );
};

export default TaskButtons;