import { useEffect, useState } from "react";
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
import { useTranslation } from "react-i18next";

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
  const { t, i18n } = useTranslation("translation", {
    keyPrefix: "tasksPage",
  });
  const [saveName, setSaveName] = useState<string>(t("tasks.buttons.save"));
  const [isName, setIsName] = useState(false);

  useEffect(() => {
    setSaveName(t(isName ? "tasks.buttons.change" : "tasks.buttons.save"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);

  const onSaveListHandler = () => {
    if (!isListWithName) {
      dispatch(
        addListRequest({
          id: nanoid(),
          name: listName,
          taskList: tasks,
        })
      );
      return;
    }

    setSaveName(t("tasks.buttons.change"));
    setIsName(true);

    const timer = setTimeout(() => {
      setSaveName(t("tasks.buttons.save"));
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
          width={i18n.language === "pl" ? "150px" : "120px"}
        >
          {saveName}
        </Button>
      )}
      <Button
        onClick={() => dispatch(toggleHideDone())}
        disabled={areTasksEmpty}
        width={i18n.language === "pl" ? "150px" : "120px"}
      >
        {hideDone ? t("tasks.buttons.show") : t("tasks.buttons.hide")}
      </Button>
      <Button
        onClick={() => dispatch(setAllDone({ tasks, listName }))}
        disabled={isEveryTaskDone || areTasksEmpty}
        width={i18n.language === "pl" ? "150px" : "120px"}
      >
        {t("tasks.buttons.allDone")}
      </Button>
      <Button
        onClick={() => dispatch(setAllUndone({ tasks, listName }))}
        disabled={isEveryTaskUndone || areTasksEmpty}
        width={i18n.language === "pl" ? "150px" : "120px"}
      >
        {t("tasks.buttons.allUndone")}
      </Button>
      <ButtonsContainer $sub>
        <Button
          disabled={undoTasksStack.length === 0 || editedTask !== null}
          onClick={() => dispatch(undoTasks())}
          title={
            undoTasksStack.length === 0 || editedTask !== null
              ? ""
              : t("tasks.buttons.undo")
          }
        >
          <UndoIcon />
        </Button>
        <Button
          disabled={redoTasksStack.length === 0 || editedTask !== null}
          onClick={() => dispatch(redoTasks())}
          title={
            redoTasksStack.length === 0 || editedTask !== null
              ? ""
              : t("tasks.buttons.redo")
          }
        >
          <RedoIcon />
        </Button>
      </ButtonsContainer>
    </ButtonsContainer>
  );
};
