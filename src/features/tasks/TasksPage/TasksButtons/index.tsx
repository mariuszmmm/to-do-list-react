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
//  selectToUpdate,
  selectListStatus,
//  setListStatus,
 // setToUpdate,
  clearTaskList,
} from "../../tasksSlice";
import { useTranslation } from "react-i18next";
import {
  getWidthForSwitchTaskSortButton,
  getWidthForToggleHideDoneButton,
} from "../../../../utils/getWidthForDynamicButtons";
import { ListsData, List, Version } from "../../../../types";
import { UseMutationResult } from "@tanstack/react-query";

type Props = {
  listsData?: ListsData;
  saveListMutation: UseMutationResult<
    any,
    Error,
    { version: Version; list: List },
    unknown
  >;
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
 // const toUpdate = useAppSelector(selectToUpdate);
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation("translation", {
    keyPrefix: "tasksPage",
  });
  const { isPending,
// isSuccess, 
isError } = saveListMutation;

  // console.log("taskListMetaData", taskListMetaData);

  // useEffect(() => {
  //   if (!listToAdd || !listsData) return;
  //   const listAlreadyExists =
  //     listsData.lists.some(({ name }) => name === listToAdd.name) || false;

  //   if (confirmed || !listAlreadyExists) {
  //     addListMutation.mutate({
  //       version: listsData.version,
  //       list: listToAdd,
  //     });
  //     dispatch(setListToAdd(null));
  //   } else {
  //     if (confirmed === false) {
  //       dispatch(setListToAdd(null));
  //       dispatch(
  //         openModal({
  //           title: { key: "modal.listSave.title" },
  //           message: {
  //             key: "modal.listSave.message.cancel",
  //           },
  //           type: "info",
  //         })
  //       );

  //       return;
  //     }

  //     if (listAlreadyExists) {
  //       dispatch(
  //         openModal({
  //           title: { key: "modal.listSave.title" },
  //           message: {
  //             key: "modal.listSave.message.confirm",
  //             values: { name: listToAdd.name },
  //           },
  //           type: "confirm",
  //         })
  //       );
  //     }
  //   }

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [listToAdd, confirmed]);

  return (
    <ButtonsContainer>
      {listsData && (
        <Button // robi się w consol.log: "[ListSync] Cleanup - clearing interval" po wciśnieciu buttona i prywa interwał
          onClick={() => {
            // dispatch(setListStatus({ isRemoteSaveable: true }));
            // dispatch(setToUpdate({ tasks, taskListMetaData }));

            saveListMutation.mutate({
              version: listsData.version,
              list: {
                id: taskListMetaData.id,
                date: taskListMetaData.date,
                name: taskListMetaData.name,
                taskList: tasks,
              },
            });


          }}
          disabled={!taskListMetaData.name || areTasksEmpty || listNameToEdit !== null}
        >
          <span>
            <CircleIcon
              $isChanged={
                // !!toUpdate &&
                tasks.length > 0 && listStatus.isRemoteSaveable && listStatus.existsInRemote && !listStatus.isIdenticalToRemote}
              $isError={isError}
              $isPending={isPending}
              $isUpdated={listStatus.isIdenticalToRemote}
            // $isUpdated={isSuccess && listStatus.isIdenticalToRemote}
            />
            {t("tasks.buttons.save")}
          </span>
        </Button>
      )}
      <Button
        onClick={() => {
          dispatch(setTaskListToArchive(tasks));
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
