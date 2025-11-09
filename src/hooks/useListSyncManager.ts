import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from ".";
import { ListsData, List, Version, Task } from "../types";
import {
  selectTaskListMetaData,
  selectTasks,
  selectToUpdate,
//  setToUpdate,
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
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check remote list status and update accordingly
  useEffect(() => {
    console.log("[checkRemoteListStatus] Starting check...");

    if (
      !listsData ||
      !taskListMetaData?.id
      // || !listStatus.isRemoteSaveable
    ) {
      console.log("[checkRemoteListStatus] Missing data:", {
        hasListsData: !!listsData,
        hasTaskListMetaData: !!taskListMetaData,
        taskListMetaDataId: taskListMetaData?.id,
        isRemoteSaveable: listStatus.isRemoteSaveable,
      });

      if (
        !listStatus.existsInRemote &&
        !listStatus.isIdenticalToRemote &&
        !listStatus.isRemoteSaveable
      ) {
        console.log("[checkRemoteListStatus] List status already reset");
        return;
      }

      console.log(
        "[checkRemoteListStatus] Resetting list status - no data available"
      );
      dispatch(setListStatus({}));
      return;
    }

    const remoteList = listsData.lists.find(
      (list) => list.id === taskListMetaData.id
    );

    if (!remoteList) {
      console.log(
        "[checkRemoteListStatus] List not found in remote. ListId:",
        taskListMetaData.id
      );

      if (listStatus.existsInRemote === false) {
        console.log(
          "[checkRemoteListStatus] Status already indicates list doesn't exist remotely"
        );
        return;
      }

      console.log(
        "[checkRemoteListStatus] Updating status - list doesn't exist remotely"
      );
      dispatch(
        setListStatus({
          ...listStatus,
          existsInRemote: false,
          isIdenticalToRemote: false,
        })
      );
      return;
    }

    const tasksMatch = areTasksEqual(remoteList.taskList, tasks);
    console.log("[checkRemoteListStatus] Comparing tasks:", {
      tasksMatch,
      remoteTasks: remoteList.taskList.length,
      localTasks: tasks.length,
    });

    if (
      listStatus.existsInRemote === true &&
      listStatus.isIdenticalToRemote === tasksMatch
      // tasksMatch
    ) {
      console.log(
        "[checkRemoteListStatus] Status unchanged - no update needed"
      );
      return;
    }

    console.log("[checkRemoteListStatus] Updating list status:", {
      isRemoteSaveable: true,
      existsInRemote: true,
      isIdenticalToRemote: tasksMatch,
    });

    dispatch(
      setListStatus({
        isRemoteSaveable: true,
        existsInRemote: true,
        isIdenticalToRemote: tasksMatch,
      })
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // toUpdate,
    // dodaj tu zależność po isSuccess z saveListMutation

    listsData, // ok
    // taskListMetaData,
    tasks,
    // listStatus,
    // dispatch
    // saveListMutation.isSuccess,
  ]);

  // Auto-save with debounce - waits 5 seconds after conditions are met
  useEffect(() => {
    if (listStatus.isIdenticalToRemote) {
      console.log("isIdenticalToRemote: ", listStatus.isIdenticalToRemote);
      console.log(
        "[handleAutoSave] List is identical to remote - skipping auto-save"
      );
      // dispatch(setToUpdate(null));
      return;
    }

    // Clear any existing timeout when dependencies change
    if (saveTimeoutRef.current) {
      console.log(
        "[handleAutoSave] Clearing previous timeout due to dependency change"
      );
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }

    // if (!toUpdate) {
    //   console.log("[handleAutoSave] No toUpdate flag - skipping");
    //   return;
    // }

    console.log(
      "[handleAutoSave] toUpdate flag detected, checking conditions...",
      {
        toUpdate,
        hasTaskListMetaData: !!taskListMetaData,
        hasListsData: !!listsData,
        hasVersion: !!listsData?.version,
        tasksCount: tasks.length,
        isRemoteSaveable: listStatus.isRemoteSaveable,
      }
    );

    if (
      !taskListMetaData ||
      !listsData ||
      !listsData.version ||
      tasks.length === 0 ||
      !listStatus.isRemoteSaveable
    ) {
      console.log("[handleAutoSave] Conditions not met - cannot save");
      return;
    }

    // Schedule save after 5 seconds
    console.log("[handleAutoSave] Scheduling save in 5 seconds...");
    saveTimeoutRef.current = setTimeout(() => {
      if (listStatus.isIdenticalToRemote) {
        console.log(
          "[handleAutoSave] List is identical to remote - skipping auto-save"
        );
        return;
      }
      console.log("[handleAutoSave] Performing auto-save after timeout", {
        listId: taskListMetaData.id,
        listName: taskListMetaData.name,
        tasksCount: tasks.length,
        version: listsData.version,
      });

      saveListMutation.mutate({
        version: listsData.version,
        list: {
          id: taskListMetaData.id,
          date: taskListMetaData.date,
          name: taskListMetaData.name,
          taskList: tasks,
        },
      });

      console.log("[handleAutoSave] Clearing toUpdate flag");
      // dispatch(setToUpdate(null));
      saveTimeoutRef.current = null;
    }, 10000);

    // Cleanup function - clear timeout when component unmounts or dependencies change
    return () => {
      if (saveTimeoutRef.current) {
        console.log("[handleAutoSave] Cleanup - clearing timeout");
        clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = null;
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // toUpdate,
    tasks,
    listStatus,

    // taskListMetaData,
    // listsData,
    // listStatus.isRemoteSaveable,
    // saveListMutation,
    // dispatch,
  ]);
};
