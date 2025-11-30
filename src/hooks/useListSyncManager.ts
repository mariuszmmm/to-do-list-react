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
  setLastSyncedAt,
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
      remoteTask.done === localTask.done &&
      !localTask.deleted
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
  const deviceId = getOrCreateDeviceId();
  const { isPending, isError } = saveListMutation;

  /**
   * Updates the list sync status (whether it can be saved remotely, whether it is identical).
   */
  useEffect(() => {
    if (!listsData) {
      if (listStatus.isRemoteSaveable || listStatus.isIdenticalToRemote)
        console.log(
          "1. B [setListStatus] No lists data - resetting list status."
        );
      dispatch(
        setListStatus({ isRemoteSaveable: false, isIdenticalToRemote: false })
      );

      return;
    }
    // else if (listsData.conflict) return;

    console.log("1. A [setListStatus] Checking and updating list status...");

    const remoteList = listsData.lists.find(
      (list) => list.id === taskListMetaData.id
    );

    if (!remoteList) {
      if (!listStatus.isRemoteSaveable && !listStatus.isIdenticalToRemote)
        return;

      console.log(
        "1. C [setListStatus] Remote list not found - resetting list status."
      );
      dispatch(
        setListStatus({ isRemoteSaveable: false, isIdenticalToRemote: false })
      );
      return;
    }

    const isIdentical = areTasksAndMetaDataEqual(
      remoteList,
      taskListMetaData,
      tasks
    );

    console.log("1. D [setListStatus] Updating list status:", {
      isRemoteSaveable: true,
      isIdenticalToRemote: isIdentical,
    });

    console.log("taskListMetaData.updatedAt", taskListMetaData.updatedAt);
    console.log("tasks", tasks);
    console.log("listsData.lists[0].taskList", listsData.lists[0].taskList);
    console.log("listsData", listsData);

    if (isError) {
      dispatch(
        setListStatus({ isRemoteSaveable: false, isIdenticalToRemote: false })
      );
    } else {
      dispatch(
        setListStatus({
          isRemoteSaveable: true,
          isIdenticalToRemote: isIdentical,
        })
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listsData, taskListMetaData, tasks]);

  /**
   * Syncs remote changes to local state (if the remote list differs from the local one).
   */
  useEffect(() => {
    if (!listsData || !listStatus.isRemoteSaveable) return;
    console.log("2. A [update local list] Checking for remote updates...");

    const remoteList = listsData.lists.find(
      (list) => list.id === taskListMetaData.id
    );

    if (!!remoteList) {
      const isIdentical = areTasksAndMetaDataEqual(
        remoteList,
        taskListMetaData,
        tasks
      );

      let newTasks: Task[] = [];

      console.log("remoteList", remoteList);
      console.log("TEST", {
        updatedAt: listsData.updatedAt,
        taskListMetaDataUpdatedAt: taskListMetaData.updatedAt,
      });
      if (
        listsData.conflict ||
        (!!listsData.updatedAt &&
          !!taskListMetaData.updatedAt &&
          listsData.updatedAt < taskListMetaData.updatedAt) ||
        !!listsData.deletedTasksIds
      ) {
        newTasks = [...remoteList.taskList];
      } else {
        const localOnlyTasks = !!listsData.deletedTasksIds
          ? tasks.filter(
              (localTask) =>
                !remoteList.taskList.some(
                  (taskList) => taskList.id === localTask.id
                ) && listsData.deletedTasksIds?.includes(localTask.id) === false
            )
          : tasks.filter(
              (localTask) =>
                !remoteList.taskList.some(
                  (taskList) => taskList.id === localTask.id
                )
            );

        console.log("deviceId", deviceId);
        console.log("listsData.deviceId", listsData.deviceId);
        console.log("listsData.deletedTasksIds", listsData.deletedTasksIds);

        const updatedTasks = remoteList.taskList.map((remoteTask) => {
          const localTask = tasks.find((local) => local.id === remoteTask.id);
          if (!localTask) return remoteTask;
          return localTask.updatedAt > remoteTask.updatedAt
            ? localTask
            : remoteTask;
        });

        newTasks = [...updatedTasks, ...localOnlyTasks];
      }

      if (!isIdentical) {
        console.log("2. B [update local list] Updating local list", remoteList);
        dispatch(
          setTasks({
            taskListMetaData: {
              id: remoteList.id,
              name: remoteList.name,
              date: remoteList.date,
            },
            tasks: newTasks,
            ...(!listsData.deletedTasksIds
              ? { stateForUndo: { tasks, taskListMetaData } }
              : {}),
          })
        );
      }
      console.log("2. C [update local list] setLastSyncedAt");
      dispatch(setLastSyncedAt());
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listsData]);

  /**
   * Triggers saving the list to the remote API if the local list differs from the remote one.
   */

  useEffect(() => {
    if (
      !listsData ||
      isPending ||
      (!listStatus.isRemoteSaveable && !listStatus.manualSaveTriggered) ||
      (listStatus.isRemoteSaveable && listStatus.isIdenticalToRemote)
    )
      return;

    console.log("3. A [Save remote] Checking if remote save is needed...");

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

    console.log("3. B [Save remote] Saving list to remote...", {
      taskListMetaData,
      tasks,
    });
    saveListMutation.mutate({
      list: {
        id: taskListMetaData.id,
        date: taskListMetaData.date,
        name: taskListMetaData.name,
        version,
        taskList: tasks,
        deviceId,
        updatedAt: taskListMetaData.updatedAt,
      },
    });
    listStatus.manualSaveTriggered &&
      dispatch(setListStatus({ manualSaveTriggered: false }));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listStatus, taskListMetaData, tasks]);
};
