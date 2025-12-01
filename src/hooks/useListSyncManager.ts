import { getOrCreateDeviceId } from "../utils/deviceId";
import { useEffect, useRef } from "react";
import debounce from "lodash.debounce";
import { DebouncedFunc } from "lodash";
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
} from "../features/tasks/tasksSlice";
import { UseMutationResult } from "@tanstack/react-query";

interface UseListSyncManagerParams {
  listsData?: ListsData;
  saveListMutation: UseMutationResult<
    { data: ListsData },
    Error,
    { list: List; deviceId: string },
    unknown
  >;
}
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
  const pendingTasksRef = useRef<Task[]>(tasks);
  const pendingMetaRef = useRef<TaskListMetaData>(taskListMetaData);
  const pendingLocalChangesRef = useRef<boolean>(false);
  const debouncedMutateRef = useRef<DebouncedFunc<
    (payload: { list: List; deviceId: string }) => void
  > | null>(null);

  // Mark that there are local changes whenever tasks or metadata change
  useEffect(() => {
    if (!listsData) {
      dispatch(
        setListStatus({ isRemoteSaveable: false, isIdenticalToRemote: false })
      );
      return;
    }

    const remoteList = listsData.lists.find(
      (list) => list.id === taskListMetaData.id
    );

    if (!remoteList) {
      if (!listStatus.isRemoteSaveable && !listStatus.isIdenticalToRemote)
        return;

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

  // Update local list if remote data changes
  useEffect(() => {
    if (
      !listsData ||
      !listStatus.isRemoteSaveable ||
      pendingLocalChangesRef.current
    )
      return;

    const remoteList = listsData.lists.find(
      (list) => list.id === taskListMetaData.id
    );
    if (!remoteList) return;

    const isIdentical = areTasksAndMetaDataEqual(
      remoteList,
      taskListMetaData,
      tasks
    );

    if (isIdentical) return;

    console.log("TEST", { remoteList, taskListMetaData, tasks });

    let newTasks: Task[] = [];
    let newMeta: TaskListMetaData;

    if (listsData.conflict) {
      newMeta = {
        id: remoteList.id,
        name: remoteList.name,
        date: remoteList.date,
        updatedAt: remoteList.updatedAt,
      };
      newTasks = [...remoteList.taskList];
    } else {
      const localOnlyTasks = !!listsData.deletedTasksIds
        ? tasks.filter((localTask) => {
            const isDeleted =
              listsData.deletedTasksIds?.includes(localTask.id) === true;
            const isNotInRemote = !remoteList.taskList.some(
              (task) => task.id === localTask.id
            );

            return (
              (isNotInRemote && !isDeleted) ||
              (isDeleted && localTask.updatedAt > remoteList.updatedAt)
            );
          })
        : tasks.filter(
            (localTask) =>
              !remoteList.taskList.some(
                (taskList) => taskList.id === localTask.id
              )
          );

      const updatedTasks = remoteList.taskList.map((remoteTask) => {
        const localTask = tasks.find((local) => local.id === remoteTask.id);
        if (!localTask) return remoteTask;
        return localTask.updatedAt > remoteTask.updatedAt
          ? localTask
          : remoteTask;
      });

      const sourceMeta =
        taskListMetaData.updatedAt > remoteList.updatedAt
          ? taskListMetaData
          : remoteList;
      newMeta = {
        id: sourceMeta.id,
        name: sourceMeta.name,
        date: sourceMeta.date,
        updatedAt: sourceMeta.updatedAt,
      };
      newTasks = [...updatedTasks, ...localOnlyTasks];
    }

    dispatch(setTasks({ taskListMetaData: newMeta, tasks: newTasks }));
    pendingTasksRef.current = newTasks;
    pendingMetaRef.current = newMeta;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listsData]);

  // Initialize debounced mutate function
  useEffect(() => {
    debouncedMutateRef.current = debounce(
      (payload: { list: List; deviceId: string }) => {
        saveListMutation.mutate(payload);
      },
      1000
    );
    return () => {
      debouncedMutateRef.current && debouncedMutateRef.current.cancel();
    };
  }, [saveListMutation]);

  // Keep refs updated with latest tasks and metadata
  useEffect(() => {
    pendingTasksRef.current = tasks;
    pendingMetaRef.current = taskListMetaData;
  }, [tasks, taskListMetaData]);

  // Trigger save when there are local changes
  useEffect(() => {
    if (
      !listsData ||
      isPending ||
      (!listStatus.isRemoteSaveable && !listStatus.manualSaveTriggered) ||
      (listStatus.isRemoteSaveable && listStatus.isIdenticalToRemote)
    )
      return;

    const remoteList = listsData.lists.find(
      (list) => list.id === taskListMetaData.id
    );
    const isIdentical = remoteList
      ? areTasksAndMetaDataEqual(remoteList, taskListMetaData, tasks)
      : false;

    if (isIdentical) return;

    const version =
      listsData.lists.find((list) => list.id === taskListMetaData.id)
        ?.version || 0;

    if (changeSource === "remote") {
      dispatch(setChangeSource(null));
      return;
    }

    const payload = {
      list: {
        id: pendingMetaRef.current.id,
        date: pendingMetaRef.current.date,
        updatedAt: pendingMetaRef.current.updatedAt,
        name: pendingMetaRef.current.name,
        taskList: pendingTasksRef.current,
        version,
      },
      deviceId,
    };

    if (listStatus.manualSaveTriggered) {
      saveListMutation.mutate(payload);
      pendingLocalChangesRef.current = false;
      dispatch(setListStatus({ manualSaveTriggered: false }));
    } else if (debouncedMutateRef.current) {
      debouncedMutateRef.current(payload);
      pendingLocalChangesRef.current = false;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    listStatus,
    taskListMetaData,
    tasks,
    pendingTasksRef.current,
    pendingMetaRef.current,
  ]);
};
