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
  switchTasksSort,
  selectIsTasksSorting,
  setTaskListToArchive,
  selectListStatus,
  clearTaskList,
  setListStatus,
  setChangeSource,
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
  saveListMutation: UseMutationResult<{ data: ListsData }, Error, { list: List, deviceId: string }, unknown>;
};

export const TasksButtons = ({ listsData, saveListMutation }: Props) => {
  const areTasksEmpty = useAppSelector(selectAreTasksEmpty);
  const hideDone = useAppSelector(selectHideDone);
  const isEveryTaskDone = useAppSelector(selectIsEveryTaskDone);
  const isEveryTaskUndone = useAppSelector(selectIsEveryTaskUndone);
  const undoTasksStack = useAppSelector(selectUndoTasksStack);
  const redoTasksStack = useAppSelector(selectRedoTasksStack);
  const tasks = useAppSelector(selectTasks);
  const editedTaskContent = useAppSelector(selectEditedTask);
  const listNameToEdit = useAppSelector(selectListNameToEdit);
  const taskListMetaData = useAppSelector(selectTaskListMetaData);
  const isTasksSorting = useAppSelector(selectIsTasksSorting);
  const listStatus = useAppSelector(selectListStatus);
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation("translation", {
    keyPrefix: "tasksPage",
  });
  const { isPending, isError } = saveListMutation;

  const isChanged =
    listStatus.isRemoteSaveable &&
    !listStatus.isIdenticalToRemote &&
    !isError &&
    !isPending;

  return (
    <ButtonsContainer >
      {!!listsData && (
        <Button
          onClick={() => {
            dispatch(setChangeSource("local"));
            dispatch(setListStatus({ manualSaveTriggered: true }));
          }}
          disabled={
            !taskListMetaData.name || !!listNameToEdit || isPending || !!editedTaskContent || isTasksSorting
          }
        >
          <span>
            <CircleIcon
              $isChanged={isChanged}
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
          areTasksEmpty ?
            dispatch(clearTaskList({ tasks, taskListMetaData }))
            :
            dispatch(
              setTaskListToArchive({ name: taskListMetaData.name, tasks }),
            );
        }}
        disabled={!!editedTaskContent || isTasksSorting}
      >
        {t("tasks.buttons.clear")}
      </Button>
      <Button
        onClick={() => dispatch(setAllDone({ tasks, taskListMetaData }))}
        disabled={isEveryTaskDone || areTasksEmpty || !!editedTaskContent || isTasksSorting}
      >
        {t("tasks.buttons.allDone")}
      </Button>
      <Button
        onClick={() => dispatch(setAllUndone({ tasks, taskListMetaData }))}
        disabled={isEveryTaskUndone || areTasksEmpty || !!editedTaskContent || isTasksSorting}
      >
        {t("tasks.buttons.allUndone")}
      </Button>
      <Button
        onClick={() => dispatch(toggleHideDone())}
        disabled={areTasksEmpty || !!editedTaskContent || isTasksSorting}
        width={getWidthForToggleHideDoneButton(i18n.language)}
      >
        {hideDone ? t("tasks.buttons.show") : t("tasks.buttons.hide")}
      </Button>
      <Button
        onClick={() => dispatch(switchTasksSort())}
        disabled={(tasks.length < 2 && !isTasksSorting) || !!editedTaskContent}
        width={getWidthForSwitchTaskSortButton(i18n.language)}
      >
        {isTasksSorting ? t("tasks.buttons.notSort") : t("tasks.buttons.sort")}
      </Button>
      <ButtonsContainer $sub>
        <Button
          disabled={undoTasksStack.length === 0 || !!editedTaskContent || isTasksSorting}
          onClick={() => dispatch(undoTasks())}
          title={
            undoTasksStack.length === 0 || !!editedTaskContent
              ? ""
              : t("tasks.buttons.undo")
          }
        >
          <UndoIcon />
        </Button>
        <Button
          disabled={redoTasksStack.length === 0 || !!editedTaskContent || isTasksSorting}
          onClick={() => dispatch(redoTasks())}
          title={
            redoTasksStack.length === 0 || !!editedTaskContent
              ? ""
              : t("tasks.buttons.redo")
          }
        >
          <RedoIcon />
        </Button>
      </ButtonsContainer>
    </ButtonsContainer>
  )
};
