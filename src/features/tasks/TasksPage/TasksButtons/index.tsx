import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../hooks";
import { nanoid } from "@reduxjs/toolkit";
import { ButtonsContainer } from "../../../../common/ButtonsContainer";
import { Button } from "../../../../common/Button";
import { RedoIcon, UndoIcon } from "../../../../common/icons";
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
  addListRequest,
  selectIsListWithName,
  selectLists,
} from "../../../ListsPage/listsSlice";

export const TasksButtons = () => {
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
        addListRequest({
          id: nanoid(),
          name: listName,
          taskList: tasks,
        })
      );
    }

    setSaveName(isListWithName ? "Zmień nazwę listy" : "Zapisz listę");
    setIsName(isListWithName ? true : false);

    const timer = setTimeout(() => {
      setSaveName("Zapisz listę");
      setIsName(false);
    }, 2000);

    return () => clearTimeout(timer);
  };

  return (
    <ButtonsContainer>
      {lists && (
        <Button
          onClick={onSaveListHandler}
          disabled={
            !listName || areTasksEmpty || listNameToEdit !== null || isName
          }
          $error={isName}
          width="150px"
        >
          {saveName}
        </Button>
      )}
      <Button
        onClick={() => dispatch(toggleHideDone())}
        disabled={areTasksEmpty}
        width="150px"
      >
        {hideDone ? "Pokaż" : "Ukryj"} ukończone
      </Button>
      <Button
        onClick={() => dispatch(setAllDone({ tasks, listName }))}
        disabled={isEveryTaskDone || areTasksEmpty}
        width="150px"
      >
        Ukończ wszystkie
      </Button>
      <Button
        onClick={() => dispatch(setAllUndone({ tasks, listName }))}
        disabled={isEveryTaskUndone || areTasksEmpty}
        width="150px"
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
          <UndoIcon />
        </Button>
        <Button
          disabled={redoTasksStack.length === 0 || editedTask !== null}
          onClick={() => dispatch(redoTasks())}
          title={
            redoTasksStack.length === 0 || editedTask !== null ? "" : "Ponów"
          }
        >
          <RedoIcon />
        </Button>
      </ButtonsContainer>
    </ButtonsContainer>
  );
};
