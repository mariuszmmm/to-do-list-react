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
import {
  addList,
  selectIsListWithName,
  selectLists,
} from "../../../ListsPage/listsSlice";
import { nanoid } from "@reduxjs/toolkit";
import { useState } from "react";
import Undo from "../../../../common/buttonIcons/Undo";
import Redo from "../../../../common/buttonIcons/Redo";
import { useAppDispatch, useAppSelector } from "../../../../hooks";

const TasksButtons = () => {
  const areTasksEmpty = useAppSelector(selectAreTasksEmpty);
  const hideDone = useAppSelector(selectHideDone);
  const isEveryTaskDone = useAppSelector(selectIsEveryTaskDone);
  const isEveryTaskUndone = useAppSelector(selectIsEveryTaskUndone);
  const undoTasksStack = useAppSelector(selectUndoTasksStack);
  const redoTasksStack = useAppSelector(selectRedoTasksStack);
  const tasks = useAppSelector(selectTasks);
  const editedTask = useAppSelector(selectEditedTask);
  const listNameToEdit = useAppSelector(selectListNameToEdit);
  const listName = useAppSelector(selectListName);
  const lists = useAppSelector(selectLists);
  const isListWithName = useAppSelector((state) =>
    selectIsListWithName(state, listName)
  );
  const dispatch = useAppDispatch();
  const [saveName, setSaveName] = useState("Zapisz listę");
  const [isName, setIsName] = useState(false);

  const onSaveListHandler = () => {
    if (!isListWithName) {
      dispatch(
        addList({
          name: listName,
          taskList: tasks,
          id: nanoid(),
          lastLists: lists,
        })
      );
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
          disabled={
            !listName || areTasksEmpty || listNameToEdit !== null || isName
          }
          $error={isName}
        >
          {saveName}
        </Button>
        <Button
          onClick={() => dispatch(toggleHideDone())}
          disabled={areTasksEmpty}
          $noDisplay={areTasksEmpty}
        >
          {hideDone ? "Pokaż" : "Ukryj"} ukończone
        </Button>
        <Button
          onClick={() => dispatch(setAllDone({ tasks, listName }))}
          disabled={isEveryTaskDone}
          $noDisplay={areTasksEmpty}
        >
          Ukończ wszystkie
        </Button>
        <Button
          onClick={() => dispatch(setAllUndone({ tasks, listName }))}
          disabled={isEveryTaskUndone}
          $noDisplay={areTasksEmpty}
        >
          Odznacz wszystkie
        </Button>
        <ButtonsContainer $sub>
          <Button
            disabled={undoTasksStack.length === 0 || editedTask !== null}
            onClick={() => dispatch(undoTasks())}
            title={
              undoTasksStack.length === 0 || editedTask !== null ? "" : "Cofnij"
            }
          >
            <Undo />
          </Button>
          <Button
            disabled={redoTasksStack.length === 0 || editedTask !== null}
            onClick={() => dispatch(redoTasks())}
            title={
              redoTasksStack.length === 0 || editedTask !== null ? "" : "Ponów"
            }
          >
            <Redo />
          </Button>
        </ButtonsContainer>
      </>
    </ButtonsContainer>
  );
};

export default TasksButtons;
