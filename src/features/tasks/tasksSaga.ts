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
  selectListMetadata,
  selectShowSearch,
  selectTasks,
  selectTasksToArchive,
  setAllDone,
  setAllUndone,
  setListMetadata,
  setTaskListToArchive,
  setTasks,
  switchTaskSort,
  toggleHideDone,
  toggleShowSearch,
  toggleTaskDone,
  undoTasks,
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
  } else if (action.type === setArchivedListToLoad.type) {
    const archivedListToLoad = action.payload;
    if (!archivedListToLoad) return;
    listToLoadData = archivedListToLoad;
  } else {
    return;
  }

  const tasks: ReturnType<typeof selectTasks> = yield select(selectTasks);
  const listMetadata: ReturnType<typeof selectListMetadata> = yield select(
    selectListMetadata
  );

  yield put(
    setTasks({
      listMetadata,
      tasks: listToLoadData.taskList,
      stateForUndo: { tasks, listMetadata },
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

function* saveDataInLocalStorageHandler() {
  const tasks: ReturnType<typeof selectTasks> = yield select(selectTasks);
  const listMetadata: ReturnType<typeof selectListMetadata> = yield select(
    selectListMetadata
  );
  yield call(saveTasksInLocalStorage, tasks);
  yield call(saveListMetadataInLocalStorage, listMetadata);
}

function* archiveTaskListInLocalStorageHandler() {
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
    yield put(removeTasks());
    yield put(setTaskListToArchive([]));
    yield put(closeModal());
    return;
  }

  const { name }: ReturnType<typeof selectListMetadata> = yield select(
    selectListMetadata
  );
  const id = nanoid(8);
  const date = new Date().toISOString();
  const list = { id, date, name, taskList };

  yield put(addArchivedList(list));
  yield put(removeTasks());
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
      setAllDone.type,
      setAllUndone.type,
      setTasks.type,
      undoTasks.type,
      redoTasks.type,
      setListMetadata.type,
      switchTaskSort.type,
    ],
    saveDataInLocalStorageHandler
  );
  yield takeEvery(
    setTaskListToArchive.type,
    archiveTaskListInLocalStorageHandler
  );
  yield takeEvery(
    [setListToLoad.type, setArchivedListToLoad.type],
    setListToLoadHandler
  );
}
