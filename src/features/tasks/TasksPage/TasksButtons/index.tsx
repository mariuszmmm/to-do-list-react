import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { ButtonsContainer } from "../../../../common/ButtonsContainer";
import { Button } from "../../../../common/Button";
import { CircleIcon, RedoIcon, UndoIcon } from "../../../../common/icons";
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
  selectTaskListMetaData,
  selectListNameToEdit,
  selectUndoTasksStack,
  selectRedoTasksStack,
  switchTaskSort,
  selectIsTasksSorting,
  setTaskListToArchive,
  selectListStatus,
  clearTaskList,
} from "../../tasksSlice";
import { useTranslation } from "react-i18next";
import {
  getWidthForSwitchTaskSortButton,
  getWidthForToggleHideDoneButton,
} from "../../../../utils/getWidthForDynamicButtons";
import { ListsData, List } from "../../../../types";
import { UseMutationResult } from "@tanstack/react-query";

type Props = {
  listsData?: ListsData;
  saveListMutation: UseMutationResult<any, Error, { list: List }, unknown>;
};

export const TasksButtons = ({ listsData, saveListMutation }: Props) => {
  const areTasksEmpty = useAppSelector(selectAreTasksEmpty);
  const hideDone = useAppSelector(selectHideDone);
  const isEveryTaskDone = useAppSelector(selectIsEveryTaskDone);
  const isEveryTaskUndone = useAppSelector(selectIsEveryTaskUndone);
  const undoTasksStack = useAppSelector(selectUndoTasksStack);
  const redoTasksStack = useAppSelector(selectRedoTasksStack);
  const tasks = useAppSelector(selectTasks);
  const editedTask = useAppSelector(selectEditedTask);
  const listNameToEdit = useAppSelector(selectListNameToEdit);
  const taskListMetaData = useAppSelector(selectTaskListMetaData);
  const isTasksSorting = useAppSelector(selectIsTasksSorting);
  const listStatus = useAppSelector(selectListStatus);
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation("translation", {
    keyPrefix: "tasksPage",
  });
  const { isPending, isError } = saveListMutation;

  const version =
    listsData?.lists?.find((list) => list.id === taskListMetaData.id)?.version ||
    0;

  return (
    <ButtonsContainer>
      {!!listsData && (
        <Button
          onClick={() => {
            saveListMutation.mutate({
              list: {
                id: taskListMetaData.id,
                date: new Date().toISOString(),
                name: taskListMetaData.name,
                version,
                taskList: tasks,
              },
            });
          }}
          disabled={
            !taskListMetaData.name || areTasksEmpty || listNameToEdit !== null || isPending
          }
        >
          <span>
            <CircleIcon
              $isChanged={
                tasks.length > 0 &&
                listStatus.isRemoteSaveable &&
                listStatus.existsInRemote &&
                !listStatus.isIdenticalToRemote &&
                !isError &&
                !isPending
              }
              $isError={isError}
              $isPending={isPending}
              $isUpdated={listStatus.isIdenticalToRemote}
            />
            {t("tasks.buttons.save")}
          </span>
        </Button>
      )}
      <Button
        onClick={() => {
          dispatch(
            setTaskListToArchive({ tasks, listName: taskListMetaData.name }),
          );
          dispatch(clearTaskList());
        }}
        disabled={areTasksEmpty}
      >
        {t("tasks.buttons.clear")}
      </Button>
      <Button
        onClick={() => dispatch(setAllDone({ tasks, taskListMetaData }))}
        disabled={isEveryTaskDone || areTasksEmpty}
      >
        {t("tasks.buttons.allDone")}
      </Button>
      <Button
        onClick={() => dispatch(setAllUndone({ tasks, taskListMetaData }))}
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
