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
  setListName
} from "./tasksSlice";
import { getExampleTasks } from "./getExampleTasks";
import { saveListNameInLocalStorage, saveSettingsInLocalStorage, saveTasksInLocalStorage } from "../../utils/localStorage";
import { formatCurrentDate } from "../../utils/formatCurrentDate";

function* fetchExampleTasksHandler() {
  try {
    yield delay(1000);
    const tasks = yield select(selectTasks);
    const exampleTasks = yield call(getExampleTasks);
    const date = formatCurrentDate(new Date());
    const exampleTasksWithDate = exampleTasks.map(task => ({ ...task, date }));
    yield put(setTasks({ tasks: exampleTasksWithDate, listName: "Przykładowe zadania", lastTasks: tasks }));
    yield put(setListName("Przykładowe zadania"));
  } catch (error) {
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

function* saveTasksInLocalStorageHandler() {
  const tasks = yield select(selectTasks);
  yield call(saveTasksInLocalStorage, tasks);
}

function* saveListNameInLocalStorageHandler() {
  const listName = yield select(selectListName);
  yield call(saveListNameInLocalStorage, listName);
}

export function* tasksSaga() {
  yield takeLatest(fetchExampleTasks.type, fetchExampleTasksHandler);
  yield takeLatest(
    [toggleShowSearch.type, toggleHideDone.type],
    saveSettingsInLocalStorageHandler
  );
  yield takeEvery("*", saveTasksInLocalStorageHandler);
  yield takeEvery("*", saveListNameInLocalStorageHandler);
};