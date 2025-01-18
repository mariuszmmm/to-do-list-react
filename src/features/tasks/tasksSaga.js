import { delay, call, put, select, takeLatest, takeEvery, all } from "redux-saga/effects";
import {
  setTasks,
  fetchError,
  resetFetchStatus,
  selectTasks,
  fetchExampleTasks,
  toggleShowSearch,
  selectShowSearch,
  selectHideDone,
  toggleHideDone,
  selectListName,
  setListName,
  undoTasks,
  redoTasks,
  addTask,
  saveEditedTask,
  toggleTaskDone,
  removeTasks,
  setAllDone,
  setAllUndone,
} from "./tasksSlice";
import { getExampleTasks } from "./getExampleTasks";
import { saveListNameInLocalStorage, saveSettingsInLocalStorage, saveTasksInLocalStorage } from "../../utils/localStorage";
import { formatCurrentDate } from "../../utils/formatCurrentDate";
import { selectListToLoad, setListToLoad } from "../ListsPage/listsSlice";

function* fetchExampleTasksHandler() {
  try {
    yield delay(1000);
    const tasks = yield select(selectTasks);
    const listName = yield select(selectListName);
    const exampleTasks = yield call(getExampleTasks);
    const date = formatCurrentDate(new Date());
    const exampleTasksWithDate = exampleTasks.map(task => ({ ...task, date }));
    yield put(setTasks({ tasks: exampleTasksWithDate, listName: "Przykładowe zadania", stateForUndo: { tasks, listName } }));
  } catch ($error) {
    yield put(fetchError());
    yield delay(3000);
  } finally {
    yield put(resetFetchStatus());
  }
};

function* saveSettingsInLocalStorageHandler() {
  const [showSearch, hideDone] = yield all([
    select(selectShowSearch),
    select(selectHideDone)
  ]);
  yield call(saveSettingsInLocalStorage, { showSearch, hideDone });
};

function* setListToLoadHandler() {
  const tasks = yield select(selectTasks);
  const listName = yield select(selectListName);
  const listToLoad = yield select(selectListToLoad);
  yield put(setTasks({ tasks: listToLoad.list, listName: listToLoad.name, stateForUndo: { tasks, listName } }));
};

function* saveDataInLocalStorageHandler() {
  const tasks = yield select(selectTasks);
  const listName = yield select(selectListName);
  yield call(saveTasksInLocalStorage, tasks);
  yield call(saveListNameInLocalStorage, listName);
}

export function* tasksSaga() {
  yield takeLatest(fetchExampleTasks.type, fetchExampleTasksHandler);
  yield takeEvery(
    [toggleShowSearch.type, toggleHideDone.type],
    saveSettingsInLocalStorageHandler
  );
  yield takeEvery(
    [
      addTask.type,
      saveEditedTask.type,
      toggleTaskDone.type,
      removeTasks.type,
      setAllDone.type,
      setAllUndone.type,
      setTasks.type,
      setListName.type,
      undoTasks.type,
      redoTasks.type
    ],
    saveDataInLocalStorageHandler
  );
  yield takeEvery(setListToLoad.type, setListToLoadHandler);
};