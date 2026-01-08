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
  const tasksRef = useRef(tasks);
  const taskListMetaDataRef = useRef(taskListMetaData);
  const dispatch = useAppDispatch();
  const deviceId = getOrCreateDeviceId();
  const { isError } = saveListMutation;
  const debouncedMutateRef = useRef<DebouncedFunc<
    (payload: { list: List; deviceId: string }) => void
  > | null>(null);

  useEffect(() => {
    tasksRef.current = tasks;
    taskListMetaDataRef.current = taskListMetaData;
  }, [tasks, taskListMetaData]);

  // Check list status when remote or local data changes
  useEffect(() => {
    const { isRemoteSaveable, isIdenticalToRemote } = listStatus;

    process.env.NODE_ENV === "development" &&
      console.log("1 ListSyncManager useEffect triggered", {
        listsData,
        taskListMetaData,
        tasks,
        isError,
        isRemoteSaveable,
        isIdenticalToRemote,
      });

    if (!listsData) {
      if (!isRemoteSaveable && !isIdenticalToRemote) return;

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

    process.env.NODE_ENV === "development" &&
      console.log("2 ListSyncManager useEffect after checks", {
        remoteList,
        isIdentical,
        isRemoteSaveable,
        isIdenticalToRemote,
      });

    if (isError && isRemoteSaveable) {
      dispatch(
        setListStatus({ isRemoteSaveable: false, isIdenticalToRemote: false })
      );
    } else {
      if (isRemoteSaveable && isIdenticalToRemote === isIdentical) return;

      //  if (isIdentical) dispatch(updateTasksStatus({ status: "synced" }));
      dispatch(
        setListStatus({
          isRemoteSaveable: true,
          isIdenticalToRemote: isIdentical,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listsData, taskListMetaData, tasks, isError]);

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

    process.env.NODE_ENV === "development" &&
      console.log("3 ListSyncManager useEffect for updating local list", {
        remoteList,
        isIdentical,
      });

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
    process.env.NODE_ENV === "development" &&
      console.log("4 ListSyncManager updating local tasks", {
        remoteList,
        isIdentical,
        deletedIds,
        localOnlyTasks,
        remoteOnlyTasks,
        sourceMeta,
        newMeta,
        newTasks,
      });

    dispatch(
      setTasks({ isLoad: true, taskListMetaData: newMeta, tasks: newTasks })
    );

    tasksRef.current = newTasks;
    taskListMetaDataRef.current = newMeta;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listsData, listStatus.isRemoteSaveable]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Trigger save when there are local changes
  useEffect(() => {
    console.log("TRIGER SAVE USE EFFECT");
    const { isRemoteSaveable, manualSaveTriggered, isIdenticalToRemote } =
      listStatus;

    console.log("XX ", {
      a: !listsData,
      b: !isRemoteSaveable && !manualSaveTriggered,
      c: isRemoteSaveable && isIdenticalToRemote,
    });

    if (
      !listsData ||
      (!isRemoteSaveable && !manualSaveTriggered) ||
      (isRemoteSaveable && isIdenticalToRemote)
    )
      return;

    const remoteList = listsData.lists.find(
      (list) => list.id === taskListMetaData.id
    );

    // console.log("REMOTE LIST FOUND: ", remoteList);
    // if (!remoteList) return;

    const isIdentical = remoteList
      ? areTasksAndMetaDataEqual(
          remoteList,
          taskListMetaDataRef.current,
          tasksRef.current
        )
      : false;

    if (isIdentical) {
      // console.log("CANCEL SAVE - IDENTICAL");
      debouncedMutateRef.current?.cancel();
      dispatch(updateTasksStatus({ status: "synced" }));
      return;
    }

    const version = remoteList?.version || 0;

    process.env.NODE_ENV === "development" &&
      console.log("5 ListSyncManager useEffect for saving changes", {
        remoteList,
        isIdentical,
        version,
        changeSource,
        isRemoteSaveable,
        manualSaveTriggered,
        isIdenticalToRemote,
      });

    if (changeSource === "remote") {
      dispatch(setChangeSource(null));
      return;
    }

    const payload = {
      list: {
        id: taskListMetaDataRef.current.id,
        date: taskListMetaDataRef.current.date,
        updatedAt: taskListMetaDataRef.current.updatedAt,
        name: taskListMetaDataRef.current.name,
        taskList: tasksRef.current,
        version,
      },
      deviceId,
    };

    process.env.NODE_ENV === "development" &&
      console.log("6 ListSyncManager preparing to save", {
        payload,
        taskListMetaDataRef: taskListMetaDataRef.current,
        tasksRef: tasksRef.current,
      });

    if (manualSaveTriggered) {
      process.env.NODE_ENV === "development" &&
        console.log("7a ListSyncManager performing MANUAL save");
      saveListMutation.mutate(payload);
      dispatch(setListStatus({ manualSaveTriggered: false }));
    } else if (debouncedMutateRef.current) {
      process.env.NODE_ENV === "development" &&
        console.log("7b ListSyncManager performing DEBOUNCED save");
      debouncedMutateRef.current(payload);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    listStatus,
    // taskListMetaData,
    // tasks,
    listsData,
    taskListMetaDataRef.current,
    tasksRef.current,
  ]);
};
