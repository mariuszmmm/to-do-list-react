import { useSelector, useDispatch } from "react-redux";
import ButtonsContainer from "../../../../common/ButtonsContainer";
import Button from "../../../../common/Button";
import {
  selectAreTasksEmpty,
  selectHideDone,
  selectIsEveryTaskDone,
  toggleHideDone,
  setAllDone,
  undoTasks,
  redoTasks,
  selectTasks,
  selectEditedTask,
  setAllUndone,
  selectIsEveryTaskUndone,
  selectListName,
  selectListNameToEdit,
  selectUndoTasksStack,
  selectRedoTasksStack,
} from "../../tasksSlice";
import { addList, selectIsListWithName, selectLists } from "../../../ListsPage/listsSlice";
import { nanoid } from "@reduxjs/toolkit";
import { useState } from "react";
import Undo from "../../../../common/extraButtons/Undo";
import Redo from "../../../../common/extraButtons/Redo";

const TasksButtons = () => {
  const areTasksEmpty = useSelector(selectAreTasksEmpty);
  const hideDone = useSelector(selectHideDone);
  const isEveryTaskDone = useSelector(selectIsEveryTaskDone);
  const isEveryTaskUndone = useSelector(selectIsEveryTaskUndone);
  const undoTasksStack = useSelector(selectUndoTasksStack);
  const redoTasksStack = useSelector(selectRedoTasksStack);
  const tasks = useSelector(selectTasks);
  const editedTask = useSelector(selectEditedTask);
  const listNameToEdit = useSelector(selectListNameToEdit);
  const listName = useSelector(selectListName);
  const lists = useSelector(selectLists);
  const isListWithName = useSelector(state => selectIsListWithName(state, listName));
  const dispatch = useDispatch();
  const [saveName, setSaveName] = useState("Zapisz listę");
  const [isName, setIsName] = useState(false);

  const onSaveListHandler = () => {
    if (!isListWithName) {
      dispatch(addList({ name: listName, list: tasks, id: nanoid(), lastLists: lists }));
    }

    setSaveName(isListWithName ? "Zmień nazwę" : "Zapisano! ✔️");
    setIsName(isListWithName);

    const timer = setTimeout(() => {
      setSaveName("Zapisz listę");
      setIsName(false);
    }, 2000);

    return () => clearTimeout(timer);
  };

  return (
    <ButtonsContainer>
      <>
        <Button
          onClick={onSaveListHandler}
          disabled={!listName || areTasksEmpty || listNameToEdit !== null || isName}
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
          onClick={() => dispatch(setAllDone({ tasks, listName }))}
          disabled={isEveryTaskDone}
          noDisplay={areTasksEmpty}
        >
          Ukończ wszystkie
        </Button>
        <Button
          onClick={() => dispatch(setAllUndone({ tasks, listName }))}
          disabled={isEveryTaskUndone}
          noDisplay={areTasksEmpty}
        >
          Odznacz wszystkie
        </Button>
        <ButtonsContainer sub>
          <Button
            disabled={undoTasksStack.length === 0 || editedTask !== null}
            onClick={() => dispatch(undoTasks())}
            title={(undoTasksStack.length === 0 || editedTask !== null) ? "" : "Cofnij"}
          >
            <Undo />
          </Button>
          <Button
            disabled={redoTasksStack.length === 0 || editedTask !== null}
            onClick={() => dispatch(redoTasks())}
            title={(redoTasksStack.length === 0 || editedTask !== null) ? "" : "Ponów"}
          >
            <Redo />
          </Button>
        </ButtonsContainer>
      </>
    </ButtonsContainer>
  );
};

export default TasksButtons;