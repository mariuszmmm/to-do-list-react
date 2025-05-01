import { call, put, select, takeEvery } from "redux-saga/effects";
import {
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
  setListName,
  setTasks,
  switchTaskSort,
  toggleHideDone,
  toggleShowSearch,
  toggleTaskDone,
  undoTasks,
} from "./tasksSlice";
import { selectListToLoad, setListToLoad } from "../ListsPage/listsSlice";
import { openModal } from "../../Modal/modalSlice";

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
  yield takeEvery(setListToLoad.type, setListToLoadHandler);
}
