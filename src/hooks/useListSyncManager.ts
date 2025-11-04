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
      remoteTask.done === localTask.done &&
      remoteTask.date === localTask.date &&
      remoteTask.doneDate === localTask.doneDate &&
      remoteTask.editedDate === localTask.editedDate
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
      if (listStatus.isRemoteSaveable) {
        dispatch(
          setTasks({
            taskListMetaData: {
              id: listsData.lists[listIndex].id,
              date: listsData.lists[listIndex].date,
              name: listsData.lists[listIndex].name,
            },
            tasks: [...listsData.lists[listIndex].taskList],
            stateForUndo: { tasks, taskListMetaData },
          })
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listsData]);

  useEffect(() => {
    if (isPending) return;

    if (!listsData || !taskListMetaData?.id) {
      dispatch(setListStatus({}));
      return;
    }

    const remoteList = listsData.lists?.find(
      (list) => list.id === taskListMetaData.id
    );

    if (!remoteList) {
      if (!listStatus.existsInRemote && !listStatus.isIdenticalToRemote) return;
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

    dispatch(
      setListStatus({
        isRemoteSaveable: true,
        existsInRemote: true,
        isIdenticalToRemote: isIdentical,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listsData, taskListMetaData, tasks]);

  useEffect(() => {
    const version =
      listsData?.lists?.find((list) => list.id === taskListMetaData.id)
        ?.version || 0;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }

    if (
      !taskListMetaData ||
      !listsData ||
      tasks.length === 0 ||
      !listStatus.isRemoteSaveable ||
      listStatus.isIdenticalToRemote
    )
      return;

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
        clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listsData, tasks, listStatus, taskListMetaData]);
};
