import { getOrCreateDeviceId } from "../utils/deviceId";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from ".";
import { ListsData, List, Task, TaskListMetaData } from "../types";
import {
  selectTaskListMetaData,
  selectTasks,
  setListStatus,
  selectListStatus,
  setTasks,
  setChangeSource,
  selectChangeSource,
  setSynchronizeTime,
} from "../features/tasks/tasksSlice";
import { UseMutationResult } from "@tanstack/react-query";

/**
 * Compares remote list metadata and tasks with local ones.
 * Returns true if they are identical.
 */
const areTasksAndMetaDataEqual = (
  remoteList: List,
  localMeta: TaskListMetaData,
  localTasks: Task[]
): boolean => {
  const metaDataMatch =
    remoteList.id === localMeta.id && remoteList.name === localMeta.name;

  const remoteTasks = remoteList.taskList;
  if (remoteTasks.length !== localTasks.length) {
    return false;
  }

  const tasksMatch = remoteTasks.every((remoteTask, index) => {
    const localTask = localTasks[index];
    return (
      remoteTask.id === localTask.id &&
      remoteTask.content === localTask.content &&
      remoteTask.done === localTask.done
    );
  });

  return metaDataMatch && tasksMatch;
};

interface UseListSyncManagerParams {
  listsData?: ListsData;
  saveListMutation: UseMutationResult<any, Error, { list: List }, unknown>;
}

export const useListSyncManager = ({
  listsData,
  saveListMutation,
}: UseListSyncManagerParams) => {
  const taskListMetaData = useAppSelector(selectTaskListMetaData);
  const tasks = useAppSelector(selectTasks);
  const listStatus = useAppSelector(selectListStatus);
  const changeSource = useAppSelector(selectChangeSource);
  const dispatch = useAppDispatch();
  const { isPending } = saveListMutation;

  /**
   * Syncs remote changes to local state (if the remote list differs from the local one).
   */
  useEffect(() => {
    console.log("useListSyncManager: listsData changed", tasks);
    if (!listsData || !listStatus.isRemoteSaveable) return;

    const remoteList = listsData.lists.find(
      (list) => list.id === taskListMetaData.id
    );

    if (!!remoteList) {
      const isIdentical = areTasksAndMetaDataEqual(
        remoteList,
        taskListMetaData,
        tasks
      );

      
const unsyncedTasks = tasks.filter((task) => !task.synchronized);
      const uniqueUnsyncedTasks = unsyncedTasks.filter(
        (task) =>
          remoteList.taskList.findIndex(
            (remoteTask) => remoteTask.id === task.id
          ) === -1
      );

      console.log(uniqueUnsyncedTasks);

      


      if (!isIdentical || uniqueUnsyncedTasks.length > 0) {
        dispatch(
          setTasks({
            taskListMetaData: {
              id: remoteList.id,
              date: remoteList.date,
              name: remoteList.name,
            },
            tasks:
              uniqueUnsyncedTasks.length > 0
                ? [...remoteList.taskList, ...uniqueUnsyncedTasks]
                : remoteList.taskList,
            stateForUndo: null,
          })
        );
      }


// czy setSynchronizeTime nie powinno byc pod  setTasks tak jak w taskSaga
      dispatch(
        setSynchronizeTime({
          synchronizedTime: new Date().toISOString(),
          tasks:
            uniqueUnsyncedTasks.length > 0
              ? [...remoteList.taskList, ...uniqueUnsyncedTasks]
              : remoteList.taskList,
        })
      );



    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listsData]);

  /**
   * Updates the list sync status (whether it can be saved remotely, whether it is identical).
   */
  useEffect(() => {
    if (listsData?.conflict) return;
    if (!listsData) {
      if (listStatus.isRemoteSaveable || listStatus.isIdenticalToRemote)
        dispatch(setListStatus({}));

      return;
    }

    const remoteList = listsData.lists.find(
      (list) => list.id === taskListMetaData.id
    );

    if (!remoteList) {
      if (!listStatus.isRemoteSaveable && !listStatus.isIdenticalToRemote)
        return;
      dispatch(setListStatus({}));
      return;
    }

    const isIdentical = areTasksAndMetaDataEqual(
      remoteList,
      taskListMetaData,
      tasks
    );

    dispatch(
      setListStatus({
        isRemoteSaveable: true,
        isIdenticalToRemote: isIdentical,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listsData, taskListMetaData, tasks]);

  /**
   * Triggers saving the list to the remote API if the local list differs from the remote one.
   */
  const deviceId = getOrCreateDeviceId();
  useEffect(() => {
    if (
      !taskListMetaData ||
      !listsData ||
      !listStatus.isRemoteSaveable ||
      (listStatus.isRemoteSaveable && listStatus.isIdenticalToRemote) ||
      isPending
    )
      return;

    const remoteList = listsData.lists.find(
      (list) => list.id === taskListMetaData.id
    );
    const isIdentical = remoteList
      ? areTasksAndMetaDataEqual(remoteList, taskListMetaData, tasks)
      : false;

    if (isIdentical) {
      return;
    }

    const version =
      listsData.lists.find((list) => list.id === taskListMetaData.id)
        ?.version || 0;

    if (changeSource === "remote") {
      dispatch(setChangeSource(null));
      return;
    }

    saveListMutation.mutate({
      list: {
        id: taskListMetaData.id,
        date: taskListMetaData.date,
        name: taskListMetaData.name,
        version,
        taskList: tasks,
        deviceId,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listStatus, taskListMetaData, tasks]);
};
