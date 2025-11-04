import { useEffect, useRef, useCallback } from "react";
import { useAppDispatch, useAppSelector } from ".";
import { ListsData, List, Version, Task } from "../types";
import {
  selectTaskListMetaData,
  selectTasks,
  selectToUpdate,
  setToUpdate,
  setListStatus,
  selectListStatus,
} from "../features/tasks/tasksSlice";
import { UseMutationResult } from "@tanstack/react-query";

const areTasksEqual = (remoteTasks: Task[], localTasks: Task[]): boolean => {
  if (remoteTasks === localTasks) {
    return true;
  }
  if (remoteTasks.length !== localTasks.length) {
    return false;
  }

  return remoteTasks.every((remoteTask, index) => {
    const localTask = localTasks[index];
    return (
      remoteTask.id === localTask.id &&
      remoteTask.content === localTask.content &&
      remoteTask.done === localTask.done &&
      remoteTask.date === localTask.date &&
      remoteTask.doneDate === localTask.doneDate &&
      remoteTask.editedDate === localTask.editedDate
    );
  });
};

interface UseListSyncManagerParams {
  listsData?: ListsData;
  saveListMutation: UseMutationResult<
    any,
    Error,
    { version: Version; list: List },
    unknown
  >;
}

export const useListSyncManager = ({
  listsData,
  saveListMutation,
}: UseListSyncManagerParams) => {
  const toUpdate = useAppSelector(selectToUpdate);
  const taskListMetaData = useAppSelector(selectTaskListMetaData);
  const tasks = useAppSelector(selectTasks);
  const listStatus = useAppSelector(selectListStatus);
  const dispatch = useAppDispatch();
  const autoSaveCounterRef = useRef(0);

  const checkRemoteListStatus = useCallback(() => {
    if (!listsData || !taskListMetaData?.id || !listStatus.isRemoteSaveable) {
      console.log("TESTTTTT");
      if (
        !listStatus.existsInRemote &&
        !listStatus.isIdenticalToRemote &&
        !listStatus.isRemoteSaveable
      ) {
        return;
      }
      dispatch(
        setListStatus({
          existsInRemote: false,
          isIdenticalToRemote: false,
          isRemoteSaveable: false,
        })
      );
      return;
    }

    const remoteList = listsData.lists.find(
      (list) => list.id === taskListMetaData.id
    );

    if (!remoteList) {
      if (listStatus.existsInRemote) {
        return;
      }
      dispatch(
        setListStatus({
          ...listStatus,
          existsInRemote: false,
        })
      );
      return;
    }

    const tasksMatch = areTasksEqual(remoteList.taskList, tasks);
    if (
      listStatus.existsInRemote &&
      listStatus.isIdenticalToRemote === tasksMatch
    ) {
      return;
    }

    dispatch(
      setListStatus({
        ...listStatus,
        existsInRemote: true,
        isIdenticalToRemote: tasksMatch,
      })
    );
  }, [listsData, taskListMetaData, tasks, listStatus, dispatch]);

  const handleAutoSave = useCallback(() => {
    if (
      !toUpdate ||
      !taskListMetaData ||
      !listsData ||
      !listsData.version ||
      tasks.length === 0 ||
      !listStatus.isRemoteSaveable
    ) {
      autoSaveCounterRef.current = 0;
      return;
    }

    autoSaveCounterRef.current += 1;
    console.log(`[AutoSave] Counter: ${autoSaveCounterRef.current}/1`);

    if (autoSaveCounterRef.current >= 1) {
      console.log("[AutoSave] Performing auto-save now.");
      saveListMutation.mutate({
        version: listsData.version,
        list: {
          id: taskListMetaData.id,
          date: taskListMetaData.date,
          name: taskListMetaData.name,
          taskList: tasks,
        },
      });

      dispatch(setToUpdate(null));
      autoSaveCounterRef.current = 0;
    }
  }, [
    toUpdate,
    taskListMetaData,
    listsData,
    tasks,
    listStatus.isRemoteSaveable,
    saveListMutation,
    dispatch,
  ]);

  useEffect(() => {
    const intervalCallback = () => {
      // console.log("[ListSync] Interval tick");

      // console.log(
      //   "listsData: ",
      //   listsData,
      //   "taskListMetaData: ",
      //   taskListMetaData,
      //   "tasks: ",
      //   tasks,
      //   "toUpdate: ",
      //   toUpdate
      // );
      if (!listsData) {
        clearInterval(intervalId);
        return;
      }
      checkRemoteListStatus();
      handleAutoSave();
    };

    checkRemoteListStatus();

    const intervalId = setInterval(intervalCallback, 5000);

    return () => {
      console.log("[ListSync] Cleanup - clearing interval");
      clearInterval(intervalId);
    };
  }, [
    listsData,
    taskListMetaData,
    tasks,
    toUpdate,
    // checkRemoteListStatus,
    // handleAutoSave,
  ]);

  useEffect(() => {
    if (toUpdate) {
      console.log("[AutoSave] Reset counter - new changes detected");
      autoSaveCounterRef.current = 0;
    }
  }, [toUpdate]);
};
