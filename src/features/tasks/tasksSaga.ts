import { nanoid } from "@reduxjs/toolkit";
import { call, put, race, select, take, takeEvery } from "redux-saga/effects";
import {
  saveListMetadataInLocalStorage,
  saveSettingsInLocalStorage,
  saveTasksInLocalStorage,
} from "../../utils/localStorage";
import {
  addTask,
  redoTasks,
  removeTask,
  removeTasks,
  saveEditedTask,
  selectHideDone,
  selectTaskListMetaData,
  selectShowSearch,
  selectTasks,
  selectTasksToArchive,
  setAllDone,
  setAllUndone,
  setListMetadata,
  setTaskListToArchive,
  setTasks,
  setToUpdate,
  taskMoveDown,
  taskMoveUp,
  toggleHideDone,
  toggleShowSearch,
  toggleTaskDone,
  undoTasks,
  clearTaskList,
  setListStatus,
  selectListStatus,
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
import { Task } from "../../types";

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
    date: string;
    taskList: Task[];
    name: string;
  } | null = null;

  if (action.type === setListToLoad.type) {
    const listToLoad: ReturnType<typeof selectListToLoad> = yield select(
      selectListToLoad
    );
    if (!listToLoad) return;
    listToLoadData = listToLoad;
    yield put(
      setListStatus({
        isRemoteSaveable: true,
        existsInRemote: true,
        isIdenticalToRemote: true,
      })
    );
  } else if (action.type === setArchivedListToLoad.type) {
    const archivedListToLoad = action.payload;
    if (!archivedListToLoad) return;
    listToLoadData = archivedListToLoad;
  } else {
    return;
  }

  const tasks: ReturnType<typeof selectTasks> = yield select(selectTasks);
  const taskListMetaData: ReturnType<typeof selectTaskListMetaData> =
    yield select(selectTaskListMetaData);
//  const { isRemoteSaveable }: ReturnType<typeof selectListStatus> =
    yield select(selectListStatus);

  // if (isRemoteSaveable) yield put(setListStatus({}));

  yield put(
    setTasks({
      taskListMetaData: {
        id: listToLoadData.id,
        date: listToLoadData.date,
        name: listToLoadData.name,
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
  const taskListMetaData: ReturnType<typeof selectTaskListMetaData> =
    yield select(selectTaskListMetaData);

  console.log(
    "SAGA - setToUpdate({ tasks, taskListMetaData }):",
    taskListMetaData,
    tasks
  );

  yield call(saveTasksInLocalStorage, tasks);
  yield call(saveListMetadataInLocalStorage, taskListMetaData);
}

function* setListStatusHandler() {
 // const {isRemoteSaveable, isIdenticalToRemote }: ReturnType<typeof selectListStatus> = yield select(selectListStatus);
  const tasks: ReturnType<typeof selectTasks> = yield select(selectTasks);
  const taskListMetaData: ReturnType<typeof selectTaskListMetaData> =
    yield select(selectTaskListMetaData);

//  if (isRemoteSaveable && !isIdenticalToRemote)
    yield put(setToUpdate({ tasks, taskListMetaData }));
}

function* archiveTasksHandler() {
  const taskList: ReturnType<typeof selectTasksToArchive> = yield select(
    selectTasksToArchive
  );

  if (taskList.length === 0) return;

  yield put(
    openModal({
      title: { key: "modal.archiveTasks.title" },
      message: { key: "modal.archiveTasks.message.confirm" },
      type: "yes/no",
    })
  );

  const { cancelled } = yield race({
    confirmed: take(confirm),
    cancelled: take(cancel),
  });

  if (cancelled) {
    yield put(setTaskListToArchive([]));
    yield put(closeModal());
    return;
  }

  const { name }: ReturnType<typeof selectTaskListMetaData> = yield select(
    selectTaskListMetaData
  );
  const id = nanoid(8);
  const date = new Date().toISOString();
  const list = { id, date, name, taskList };

  yield put(addArchivedList(list));
  yield put(setTaskListToArchive([]));
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
      removeTasks.type,
      clearTaskList.type,
      setAllDone.type,
      setAllUndone.type,
      setTasks.type,
      undoTasks.type,
      redoTasks.type,
      setListMetadata.type,
      taskMoveUp.type,
      taskMoveDown.type,
    ],
    saveTasksInLocalStorageHandler
  );

  yield takeEvery(clearTaskList.type, archiveTasksHandler);

  yield takeEvery(
    [setListToLoad.type, setArchivedListToLoad.type],
    setListToLoadHandler
  );

  yield takeEvery(setListStatus.type, setListStatusHandler);
}
