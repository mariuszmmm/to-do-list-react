import { useEffect, useRef } from "react";
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

  useEffect(() => {
    const areTasksEqual = (
      remoteTasks: Task[],
      localTasks: Task[]
    ): boolean => {
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

    const checkRemoteListStatus = () => {
      if (!listsData || !taskListMetaData?.id) {
        console.log(
          "[ListSync] No lists data or task list metadata available."
        );
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
        console.log("[ListSync] Remote list does not exist.");
        dispatch(
          setListStatus({
            ...listStatus,
            existsInRemote: true, // zaznaczamy, że lista nie istnieje
          })
        );
        return;
      }

      // Lista istnieje, sprawdź czy zadania są identyczne
      const tasksMatch = areTasksEqual(remoteList.taskList, tasks);
      console.log("[ListSync] Remote list exists. Tasks match:", tasksMatch);
      dispatch(
        setListStatus({
          ...listStatus,
          isIdenticalToRemote: tasksMatch,
        })
      );
    };

    const handleAutoSave = () => {
      // Sprawdź warunki do auto-save
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

      // Zwiększ licznik
      autoSaveCounterRef.current += 1;
      console.log(`[AutoSave] Counter: ${autoSaveCounterRef.current}/1`);

      // Zapisz po 5 sekundach (1 interwał)
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
    };

    const intervalCallback = () => {
      console.log("[ListSync] Interval tick");

      console.log(
        "listsData: ",
        listsData,
        "taskListMetaData: ",
        taskListMetaData,
        "tasks: ",
        tasks,
        "toUpdate: ",
        toUpdate
      );
      if (!listsData) {
        clearInterval(intervalId);
        return;
      }
      checkRemoteListStatus();
      handleAutoSave();
    };

    // Sprawdź natychmiast przy montowaniu
    checkRemoteListStatus();

    // Uruchom interval co 5 sekund
    const intervalId = setInterval(intervalCallback, 5000);

    return () => {
      console.log("[ListSync] Cleanup - clearing interval");
      clearInterval(intervalId);
    };
    // eslint-disable-next-line
  }, [
    listsData,
    taskListMetaData,
    tasks,
    toUpdate,
    // dispatch,
    // saveListMutation,
  ]);

  // Reset licznika gdy zmieni się toUpdate
  useEffect(() => {
    if (toUpdate) {
      console.log("[AutoSave] Reset counter - new changes detected");
      autoSaveCounterRef.current = 0;
    }
  }, [toUpdate]);
};
