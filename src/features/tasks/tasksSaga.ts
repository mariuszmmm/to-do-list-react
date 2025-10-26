import { nanoid } from "@reduxjs/toolkit";
import { call, put, race, select, take, takeEvery } from "redux-saga/effects";
import {
  archiveTasksInLocalStorage,
  saveListNameInLocalStorage,
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
  selectListName,
  selectShowSearch,
  selectTasks,
  setAllDone,
  setAllUndone,
  setTasksToArchive,
  setListName,
  setTasks,
  switchTaskSort,
  toggleHideDone,
  toggleShowSearch,
  toggleTaskDone,
  undoTasks,
  selectTasksToArchive,
} from "./tasksSlice";
import { selectListToLoad, setListToLoad } from "../ListsPage/listsSlice";
import { cancel, closeModal, confirm, openModal } from "../../Modal/modalSlice";

function* saveSettingsInLocalStorageHandler() {
  const showSearch: ReturnType<typeof selectShowSearch> = yield select(
    selectShowSearch
  );
  const hideDone: ReturnType<typeof selectHideDone> = yield select(
    selectHideDone
  );

  yield call(saveSettingsInLocalStorage, { showSearch, hideDone });
}

function* setListToLoadHandler() {
  const listToLoad: ReturnType<typeof selectListToLoad> = yield select(
    selectListToLoad
  );
  if (listToLoad === null) return;

  const tasks: ReturnType<typeof selectTasks> = yield select(selectTasks);
  const listName: ReturnType<typeof selectListName> = yield select(
    selectListName
  );
  yield put(
    setTasks({
      tasks: listToLoad.taskList,
      listName: listToLoad.name,
      stateForUndo: { tasks, listName },
    })
  );
  yield put(
    openModal({
      title: { key: "modal.listLoad.title" },
      message: {
        key: "modal.listLoad.message.info",
        values: { listName: listToLoad.name },
      },
      type: "info",
    })
  );
}

function* saveDataInLocalStorageHandler() {
  const tasks: ReturnType<typeof selectTasks> = yield select(selectTasks);
  const listName: ReturnType<typeof selectListName> = yield select(
    selectListName
  );
  yield call(saveTasksInLocalStorage, tasks);
  yield call(saveListNameInLocalStorage, listName);
}

function* archiveTasksInLocalStorageHandler() {
  const tasks: ReturnType<typeof selectTasksToArchive> = yield select(
    selectTasksToArchive
  );
  const listName: ReturnType<typeof selectListName> = yield select(
    selectListName
  );

  if (!tasks) return;

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
    yield put(closeModal());
    return;
  }

  const id = nanoid(8);
  const title = `Lista z dnia ${new Date().toLocaleString()}`;
  const tasksWithMeta = { id, title, listName, tasks };

  yield call(archiveTasksInLocalStorage, tasksWithMeta);
  yield put(removeTasks());
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
      setAllDone.type,
      setAllUndone.type,
      setTasks.type,
      undoTasks.type,
      redoTasks.type,
      setListName.type,
      switchTaskSort.type,
    ],
    saveDataInLocalStorageHandler
  );
  yield takeEvery(setTasksToArchive.type, archiveTasksInLocalStorageHandler);
  yield takeEvery(setListToLoad.type, setListToLoadHandler);
}
