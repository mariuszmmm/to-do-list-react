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
  setTaskListToArchive,
} from "../../tasksSlice";
import { selectListToAdd, setListToAdd } from "../../../RemoteListsPage/remoteListsSlice";
import { useTranslation } from "react-i18next";
import {
  getWidthForSwitchTaskSortButton,
  getWidthForToggleHideDoneButton,
} from "../../../../utils/getWidthForDynamicButtons";
import { useEffect } from "react";
import { ListsData } from "../../../../types";
import { openModal, selectModalConfirmed } from "../../../../Modal/modalSlice";
import { useAddListMutation } from "../../../../hooks";
import { formatCurrentDateISO } from "../../../../utils/formatCurrentDate";

type Props = { listsData?: ListsData };

export const TasksButtons = ({ listsData }: Props) => {
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
  const isTasksSorting = useAppSelector(selectIsTasksSorting);
  const listToAdd = useAppSelector(selectListToAdd);
  const confirmed = useAppSelector(selectModalConfirmed);

  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation("translation", {
    keyPrefix: "tasksPage",
  });

  const addListMutation = useAddListMutation();

  useEffect(() => {
    if (!listToAdd || !listsData) return;
    const listAlreadyExists =
      listsData.lists.some(({ name }) => name === listToAdd.name) || false;

    if (confirmed || !listAlreadyExists) {
      addListMutation.mutate({
        version: listsData.version,
        list: listToAdd,
      });
      dispatch(setListToAdd(null));
    } else {
      if (confirmed === false) {
        dispatch(setListToAdd(null));
        dispatch(
          openModal({
            title: { key: "modal.listSave.title" },
            message: {
              key: "modal.listSave.message.cancel",
            },
            type: "info",
          })
        );

        return;
      }

      if (listAlreadyExists) {
        dispatch(
          openModal({
            title: { key: "modal.listSave.title" },
            message: {
              key: "modal.listSave.message.confirm",
              values: { listName: listToAdd.name },
            },
            type: "confirm",
          })
        );
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listToAdd, confirmed]);

  return (
    <ButtonsContainer>
      {listsData && (
        <Button
          onClick={() =>
            dispatch(
              setListToAdd({
                id: nanoid(8),
                date: formatCurrentDateISO(),
                name: listName,
                taskList: tasks,
              })
            )
          }
          disabled={!listName || areTasksEmpty || listNameToEdit !== null}
        >
          {t("tasks.buttons.save")}
        </Button>
      )}
      <Button onClick={() => dispatch(setTaskListToArchive(tasks))} disabled={areTasksEmpty}>
        {t("tasks.buttons.clear")}
      </Button>
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
        width={getWidthForToggleHideDoneButton(i18n.language)}
      >
        {hideDone ? t("tasks.buttons.show") : t("tasks.buttons.hide")}
      </Button>
      <Button
        onClick={() => dispatch(switchTaskSort())}
        disabled={tasks.length < 2}
        width={getWidthForSwitchTaskSortButton(i18n.language)}
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
