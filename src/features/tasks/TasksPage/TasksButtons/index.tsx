import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
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
  switchTaskSort,
  selectIsTasksSorting,
} from "../../tasksSlice";
import { addListRequest, selectLists } from "../../../ListsPage/listsSlice";
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
  const isTasksSorting = useAppSelector(selectIsTasksSorting);
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation("translation", {
    keyPrefix: "tasksPage",
  });

  const onSaveListHandler = () => {
    dispatch(
      addListRequest({
        id: nanoid(),
        name: listName,
        taskList: tasks,
      })
    );
  };

  return (
    <ButtonsContainer>
      {lists && (
        <Button
          onClick={onSaveListHandler}
          disabled={!listName || areTasksEmpty || listNameToEdit !== null}
        >
          {t("tasks.buttons.save")}
        </Button>
      )}
      <Button
        onClick={() => dispatch(setAllDone({ tasks, listName }))}
        disabled={isEveryTaskDone || areTasksEmpty}
      >
        {t("tasks.buttons.allDone")}
      </Button>
      <Button
        onClick={() => dispatch(setAllUndone({ tasks, listName }))}
        disabled={isEveryTaskUndone || areTasksEmpty}
      >
        {t("tasks.buttons.allUndone")}
      </Button>
      <Button
        onClick={() => dispatch(toggleHideDone())}
        disabled={areTasksEmpty}
        width={i18n.language === "en" ? "92px" : "142px"}
      >
        {hideDone ? t("tasks.buttons.show") : t("tasks.buttons.hide")}
      </Button>
      <Button
        onClick={() => dispatch(switchTaskSort())}
        disabled={tasks.length < 2}
      >
        {isTasksSorting ? t("tasks.buttons.notSort") : t("tasks.buttons.sort")}
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
