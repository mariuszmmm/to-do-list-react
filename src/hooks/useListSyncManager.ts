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
  updateTasksStatus,
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
      localTask.status !== "deleted"
    );
  });

  return metaDataMatch && tasksMatch;
};

/**
 * Hook for synchronizing local and remote task lists, handling save logic, and conflict resolution.
 * Manages state updates, debounced saves, and Redux integration for collaborative editing.
 */
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
  const { isError } = saveListMutation;
  const debouncedMutateRef = useRef<DebouncedFunc<
    (payload: { list: List; deviceId: string }) => void
  > | null>(null);

  // Check list status when remote or local data changes
  useEffect(() => {
    const { isRemoteSaveable, isIdenticalToRemote } = listStatus;

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
      if (!isRemoteSaveable && !isIdenticalToRemote) return;

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
    if (isError && isRemoteSaveable) {
      dispatch(
        setListStatus({ isRemoteSaveable: false, isIdenticalToRemote: false })
      );
    } else {
      if (isRemoteSaveable && isIdenticalToRemote === isIdentical) return;

      if (isIdentical) dispatch(updateTasksStatus({ status: "synced" }));
      dispatch(
        setListStatus({
          isRemoteSaveable: true,
          isIdenticalToRemote: isIdentical,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listsData, taskListMetaData, tasks, isError, dispatch]);

  // Update local list when remote data changes
  useEffect(() => {
    const { isRemoteSaveable } = listStatus;
    if (!listsData || !isRemoteSaveable) return;

    const remoteList = listsData.lists.find(
      (list) => list.id === taskListMetaData.id
    );
    if (!remoteList) return;

    const isIdentical = areTasksAndMetaDataEqual(
      remoteList,
      taskListMetaData,
      tasks
    );

    if (isIdentical) {
      dispatch(updateTasksStatus({ status: "synced" }));
      return;
    }

    const deletedIds = listsData.deletedTasksIds ?? [];
    const localOnlyTasks = tasks.filter((localTask) => {
      if (localTask.status === "synced") return false;

      const isInDeleted = deletedIds.includes(localTask.id);
      const isInRemote = remoteList.taskList.some(
        (task) => task.id === localTask.id
      );

      if (!isInRemote && !isInDeleted) return true;

      if (isInDeleted) {
        return localTask.updatedAt > remoteList.updatedAt;
      }

      return false;
    });

    const remoteOnlyTasks = remoteList.taskList.map((remoteTask) => {
      const taskInLocal = tasks.find((local) => local.id === remoteTask.id);
      if (!taskInLocal) return remoteTask;
      return taskInLocal.updatedAt > remoteTask.updatedAt
        ? taskInLocal
        : remoteTask;
    });

    const sourceMeta =
      taskListMetaData.updatedAt > remoteList.updatedAt
        ? taskListMetaData
        : remoteList;

    const newMeta: TaskListMetaData = {
      id: sourceMeta.id,
      name: sourceMeta.name,
      date: sourceMeta.date,
      updatedAt: sourceMeta.updatedAt,
    };
    const newTasks: Task[] = [...remoteOnlyTasks, ...localOnlyTasks].map(
      (task) => ({
        ...task,
        status: task.status !== "deleted" ? "updated" : task.status,
      })
    );

    dispatch(
      setTasks({ isLoad: true, taskListMetaData: newMeta, tasks: newTasks })
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listsData]);

  // Initialize debounced save function
  useEffect(() => {
    debouncedMutateRef.current = debounce(
      (payload: { list: List; deviceId: string }) => {
        saveListMutation.mutate(payload);
      },
      5000
    );
    return () => {
      debouncedMutateRef.current && debouncedMutateRef.current.cancel();
    };
  }, [saveListMutation]);

  // Trigger save when there are local changes
  useEffect(() => {
    const { isRemoteSaveable, manualSaveTriggered, isIdenticalToRemote } =
      listStatus;

    if (
      !listsData ||
      (!isRemoteSaveable && !manualSaveTriggered) ||
      (isRemoteSaveable && isIdenticalToRemote)
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

    if (isIdentical) {
      dispatch(updateTasksStatus({ status: "synced" }));
      return;
    }

    const version = remoteList.version || 0;

    if (changeSource === "remote") {
      dispatch(setChangeSource(null));
      return;
    }

    const payload = {
      list: {
        id: taskListMetaData.id,
        date: taskListMetaData.date,
        updatedAt: taskListMetaData.updatedAt,
        name: taskListMetaData.name,
        taskList: tasks,
        version,
      },
      deviceId,
    };

    if (manualSaveTriggered) {
      saveListMutation.mutate(payload);
      dispatch(setListStatus({ manualSaveTriggered: false }));
    } else if (debouncedMutateRef.current) {
      debouncedMutateRef.current(payload);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listStatus, taskListMetaData, tasks, listsData, dispatch]);
};
