import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from ".";
import { ListsData, List, Task, TaskListMetaData } from "../types";
import {
  selectTaskListMetaData,
  selectTasks,
  setListStatus,
  selectListStatus,
  setTasks,
} from "../features/tasks/tasksSlice";
import { UseMutationResult } from "@tanstack/react-query";

const areTasksAndMetaDataEqual = (
  remoteList: List,
  localMeta: TaskListMetaData,
  localTasks: Task[]
): boolean => {
  // Porównaj tylko ID i nazwę (bez daty - to pole techniczne)
  const metaDataMatch =
    remoteList.id === localMeta.id && remoteList.name === localMeta.name;

  const remoteTasks = remoteList.taskList;
  if (remoteTasks === localTasks) {
    return metaDataMatch;
  }
  if (remoteTasks.length !== localTasks.length) {
    return false;
  }
  const tasksMatch = remoteTasks.every((remoteTask, index) => {
    const localTask = localTasks[index];
    return (
      remoteTask.id === localTask.id &&
      remoteTask.content === localTask.content &&
      remoteTask.done === localTask.done
      // Nie porównujemy dat - to pola techniczne które się zmieniają przy każdym zapisie
      // remoteTask.date === localTask.date &&
      // remoteTask.doneDate === localTask.doneDate &&
      // remoteTask.editedDate === localTask.editedDate
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
  const dispatch = useAppDispatch();
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { isPending } = saveListMutation;

  useEffect(() => {
    if (!listsData || !taskListMetaData) return;

    const listIndex = listsData.lists?.findIndex(
      (list) => list.id === taskListMetaData.id
    );

    if (listIndex !== -1) {
      const incomingList = listsData.lists[listIndex];
      const mergedTasks = [...tasks];

      for (const incomingTask of incomingList.taskList) {
        const existingTaskIndex = mergedTasks.findIndex(
          (t) => t.id === incomingTask.id
        );

        if (existingTaskIndex !== -1) {
          const existingTask = mergedTasks[existingTaskIndex];

          const clientContentChanged =
            existingTask.content !== incomingTask.content;
          const clientDoneChanged = existingTask.done !== incomingTask.done;

          if (clientContentChanged) {
            console.log(
              `Content conflict for task ${incomingTask.id}. Server version is kept.`
            );
          }

          if (clientDoneChanged) {
            if (incomingTask.done) {
              mergedTasks[existingTaskIndex] = {
                ...existingTask,
                done: true,
              };
              console.log(
                `Merged 'done' status for task ${incomingTask.id} to true.`
              );
            }
          }
        } else {
          mergedTasks.push(incomingTask);
          console.log(`Added new task with id ${incomingTask.id}.`);
        }
      }

      if (listStatus.isRemoteSaveable && !listStatus.isIdenticalToRemote) {
        // Sprawdź czy dane naprawdę się różnią przed synchronizacją
        // const isIdentical = areTasksAndMetaDataEqual(
        //   incomingList,
        //   taskListMetaData,
        //   tasks
        // );

        // if (!isIdentical) {
        console.log(
          "📥 Syncing remote list to local state:",
          listsData.lists[listIndex]
        );
        dispatch(
          setTasks({
            taskListMetaData: {
              id: incomingList.id,
              date: incomingList.date,
              name: incomingList.name,
            },
            tasks: mergedTasks,
            stateForUndo: { tasks, taskListMetaData },
          })
        );
        // } else {
        //   console.log("⏭️ Skipping sync - data is identical");
        // }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listsData]);

  useEffect(() => {
    console.log("🔄 Sync status useEffect triggered", isPending);
    if (isPending) return;
    if (!listsData || !taskListMetaData?.id) {
      console.log("No lists data or task list metadata available");
      dispatch(setListStatus({}));
      return;
    }

    console.log(
      "Checking list sync status for:",
      taskListMetaData.id,
      listsData
    );

    const remoteList = listsData.lists?.find(
      (list) => list.id === taskListMetaData.id
    );

    console.log("Found remote list:", remoteList);

    if (!remoteList) {
      if (!listStatus.existsInRemote && !listStatus.isIdenticalToRemote) return;

      console.log("List does not exist in remote:", taskListMetaData.id);
      dispatch(
        setListStatus({
          ...listStatus,
          existsInRemote: false,
          isIdenticalToRemote: false,
        })
      );
      return;
    }

    const isIdentical = areTasksAndMetaDataEqual(
      remoteList,
      taskListMetaData,
      tasks
    );

    if (
      listStatus.existsInRemote === true &&
      listStatus.isIdenticalToRemote === isIdentical
    )
      return;
    console.log("List sync status updated:", {
      existsInRemote: true,
      isIdenticalToRemote: isIdentical,
    });
    dispatch(
      setListStatus({
        isRemoteSaveable: true,
        existsInRemote: true,
        isIdenticalToRemote: isIdentical,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listsData, taskListMetaData, tasks, isPending]);

  useEffect(() => {
    console.log("🔄 Save useEffect triggered");

    const version =
      listsData?.lists?.find((list) => list.id === taskListMetaData.id)
        ?.version || 0;

    if (saveTimeoutRef.current) {
      console.log("Clearing save timeout");
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }

    console.log("Save conditions check:", {
      hasMetaData: !!taskListMetaData,
      hasListsData: !!listsData,
      tasksLength: tasks.length,
      isRemoteSaveable: listStatus.isRemoteSaveable,
      isIdenticalToRemote: listStatus.isIdenticalToRemote,
    });

    if (
      !taskListMetaData ||
      !listsData ||
      tasks.length === 0 ||
      !listStatus.isRemoteSaveable ||
      listStatus.isIdenticalToRemote
    )
      return;

    console.log("Scheduling save for list:", taskListMetaData.id);
    saveTimeoutRef.current = setTimeout(() => {
      saveListMutation.mutate({
        list: {
          id: taskListMetaData.id,
          date: new Date().toISOString(),
          name: taskListMetaData.name,
          version,
          taskList: tasks,
        },
      });

      saveTimeoutRef.current = null;
    }, 1000 * 5);

    return () => {
      if (saveTimeoutRef.current) {
        console.log("Clearing save timeout on cleanup");
        clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listsData, tasks, listStatus, taskListMetaData]);
};
