import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from ".";
import { ListsData, List, Version } from "../types";
import {
  selectListStatus,
  selectTaskListMetaData,
  selectTasks,
  selectToUpdate,
  setToUpdate,
} from "../features/tasks/tasksSlice";
import { UseMutationResult } from "@tanstack/react-query";

interface UseAutoSaveParams {
  listsData?: ListsData;
  saveListMutation: UseMutationResult<
    any,
    Error,
    { version: Version; list: List },
    unknown
  >;
}

export const useAutoSave = ({
  listsData,
  saveListMutation,
}: UseAutoSaveParams) => {
  const toUpdate = useAppSelector(selectToUpdate);
  const taskListMetaData = useAppSelector(selectTaskListMetaData);
  const tasks = useAppSelector(selectTasks);
  const { existsInRemote, isIdenticalToRemote, isRemoteSaveable } =
    useAppSelector(selectListStatus);
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log("useAutoSave useEffect triggered. Dependencies:", {
      toUpdate: !!toUpdate,
      taskListMetaData: !!taskListMetaData,
      listsData: !!listsData,
      version: listsData?.version,
      tasksCount: tasks.length,
      isRemoteSaveable,
    });

    if (
      !toUpdate ||
      !taskListMetaData ||
      !listsData ||
      !listsData.version ||
      tasks.length === 0 ||
      !isRemoteSaveable
    ) {
      console.log("Auto-save skipped due to unmet conditions.");
      return;
    }

    console.log("Auto-saving changes........");

    const timeoutId = setTimeout(() => {
      console.log("Performing auto-save now.");
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
    }, 5000);

    return () => {
      console.log("Clearing timeout - useEffect re-running");
      clearTimeout(timeoutId);
    };

    // eslint-disable-next-line
  }, [
    toUpdate,
    // dispatch,
    // listsData,
    // taskListMetaData,
    // tasks,
    // saveListMutation,
  ]);
};
