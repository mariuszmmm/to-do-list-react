import { nanoid } from "@reduxjs/toolkit";
import { call, put, race, select, take, takeEvery } from "redux-saga/effects";
import {
  saveListMetadataInLocalStorage,
  saveSettingsInLocalStorage,
  saveLastSyncedAtFromLocalStorage,
  saveTasksInLocalStorage,
} from "../../utils/localStorage";
import {
  addTask,
  redoTasks,
  removeTask,
  saveEditedTask,
  selectHideDone,
  selectTaskListMetaData,
  selectShowSearch,
  selectTasks,
  selectTasksToArchive,
  setAllDone,
  setAllUndone,
  setListName,
  setTaskListToArchive,
  setTasks,
  taskMoveDown,
  taskMoveUp,
  toggleHideDone,
  toggleShowSearch,
  toggleTaskDone,
  undoTasks,
  clearTaskList,
  setListStatus,
  selectListStatus,
  selectLastSyncedAt,
} from "./tasksSlice";
import {
  selectListToLoad,
  setListToLoad,
} from "../RemoteListsPage/remoteListsSlice";
import {
  addArchivedList,
  setArchivedListToLoad,
} from "../ArchivedListPage/archivedListsSlice";
import { cancel, closeModal, confirm, openModal } from "../../Modal/modalSlice";
import { Task, Version } from "../../types";

function* saveSettingsInLocalStorageHandler() {
  const showSearch: ReturnType<typeof selectShowSearch> = yield select(
    selectShowSearch
  );
  const hideDone: ReturnType<typeof selectHideDone> = yield select(
    selectHideDone
  );

  yield call(saveSettingsInLocalStorage, { showSearch, hideDone });
}

function* setListToLoadHandler(
  action: ReturnType<typeof setListToLoad | typeof setArchivedListToLoad>
) {
  let listToLoadData: {
    id: string;
    name: string;
    date: string;
    version: Version;
    taskList: Task[];
  } | null = null;

  if (action.type === setListToLoad.type) {
    const listToLoad: ReturnType<typeof selectListToLoad> = yield select(
      selectListToLoad
    );

    if (!listToLoad) return;
    listToLoadData = listToLoad;
  } else if (action.type === setArchivedListToLoad.type) {
    const archivedListToLoad = action.payload;
    if (!archivedListToLoad) return;
    const { isRemoteSaveable }: ReturnType<typeof selectListStatus> =
      yield select(selectListStatus);
    if (isRemoteSaveable) yield put(setListStatus({}));

    listToLoadData = {
      ...archivedListToLoad,
      id: nanoid(8),
    };
  } else {
    return;
  }

  const tasks: ReturnType<typeof selectTasks> = yield select(selectTasks);
  const taskListMetaData: ReturnType<typeof selectTaskListMetaData> =
    yield select(selectTaskListMetaData);

  yield put(
    setTasks({
      taskListMetaData: {
        id: listToLoadData.id,
        name: listToLoadData.name,
        date: listToLoadData.date,
      },
      tasks: listToLoadData.taskList,
      stateForUndo: { tasks, taskListMetaData },
    })
  );

  yield put(
    openModal({
      title: { key: "modal.listLoad.title" },
      message: {
        key: "modal.listLoad.message.info",
        values: { name: listToLoadData.name },
      },
      type: "info",
    })
  );
}

function* saveTasksInLocalStorageHandler() {
  const tasks: ReturnType<typeof selectTasks> = yield select(selectTasks);
  if (!!tasks) yield call(saveTasksInLocalStorage, tasks);

  const taskListMetaData: ReturnType<typeof selectTaskListMetaData> =
    yield select(selectTaskListMetaData);
  if (!!taskListMetaData)
    yield call(saveListMetadataInLocalStorage, taskListMetaData);

  const lastSyncedAt: ReturnType<typeof selectLastSyncedAt> = yield select(
    selectLastSyncedAt
  );
  if (!!lastSyncedAt)
    yield call(saveLastSyncedAtFromLocalStorage, lastSyncedAt);
}

function* archiveTasksHandler() {
  const tasksToArchive: ReturnType<typeof selectTasksToArchive> = yield select(
    selectTasksToArchive
  );
  const tasks: ReturnType<typeof selectTasks> = yield select(selectTasks);
  const taskListMetaData: ReturnType<typeof selectTaskListMetaData> =
    yield select(selectTaskListMetaData);

  if (!tasksToArchive) return;

  yield put(
    openModal({
      title: { key: "modal.archiveTasks.title" },
      message: { key: "modal.archiveTasks.message.confirm" },
      type: "yes/no",
    })
  );

  const { confirmed } = yield race({
    confirmed: take(confirm),
    cancelled: take(cancel),
  });
  if (confirmed) {
    yield put(
      addArchivedList({
        name: tasksToArchive.name,
        tasks: tasksToArchive.tasks,
      })
    );
  }
  yield put(clearTaskList({ tasks, taskListMetaData }));
  yield put(closeModal());
}

export function* tasksSaga() {
  yield takeEvery(
    [toggleShowSearch.type, toggleHideDone.type],
    saveSettingsInLocalStorageHandler
  );

  yield takeEvery(
    [
      addTask.type,
      saveEditedTask.type,
      toggleTaskDone.type,
      removeTask.type,
      clearTaskList.type,
      setAllDone.type,
      setAllUndone.type,
      setTasks.type,
      undoTasks.type,
      redoTasks.type,
      setListName.type,
      taskMoveUp.type,
      taskMoveDown.type,
    ],
    saveTasksInLocalStorageHandler
  );

  yield takeEvery(setTaskListToArchive.type, archiveTasksHandler);

  yield takeEvery(
    [setListToLoad.type, setArchivedListToLoad.type],
    setListToLoadHandler
  );
}
