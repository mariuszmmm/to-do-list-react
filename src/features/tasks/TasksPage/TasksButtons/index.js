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
  selectListName,
  selectEditListName,
} from "../../tasksSlice";
import { addList, selectIsListWithName } from "../../../ListsPage/listsSlice";
import { nanoid } from "@reduxjs/toolkit";
import { useState } from "react";
import Undo from "../../../../common/extraButtons/Undo";
import Redo from "../../../../common/extraButtons/Redo";

const TasksButtons = () => {
  const areTasksEmpty = useSelector(selectAreTasksEmpty);
  const hideDone = useSelector(selectHideDone);
  const isEveryTaskDone = useSelector(selectIsEveryTaskDone);
  const isEveryTaskUndone = useSelector(selectIsEveryTaskUndone);
  const undoStack = useSelector(selectUndoStack);
  const redoStack = useSelector(selectRedoStack);
  const tasks = useSelector(selectTasks);
  const editedTask = useSelector(selectEditedTask);
  const editListName = useSelector(selectEditListName);
  const listName = useSelector(selectListName);
  const isListWithName = useSelector(state => selectIsListWithName(state, listName));
  const dispatch = useDispatch();
  const [saveName, setSaveName] = useState("Zapisz listę");
  const [isName, setIsName] = useState(false);

  const onSaveListHandler = () => {
    if (!isListWithName) {
      dispatch(addList({ name: listName, list: tasks, id: nanoid() }));
    }

    setSaveName(isListWithName ? "Zmień nazwę" : "Zapisano! ✔️");
    setIsName(isListWithName);

    const timer = setTimeout(() => {
      setSaveName("Zapisz listę");
      setIsName(false);
    }, 1000);

    return () => clearTimeout(timer);
  };

  return (
    <ButtonsContainer>
      <>
        <Button
          onClick={onSaveListHandler}
          disabled={!listName || areTasksEmpty || editListName || isName}
          error={isName}
        >
          {saveName}
        </Button>
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
        <ButtonsContainer sub>
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

export default TasksButtons;