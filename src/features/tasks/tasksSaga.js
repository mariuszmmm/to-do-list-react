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
  toggleHideDone
} from "./tasksSlice";
import { getExampleTasks } from "./getExampleTasks";
import { saveSettingsInLocalStorage, saveTasksInLocalStorage } from "../../utils/localStorage";
import { formatCurrentDate } from "../../utils/formatCurrentDate";

function* fetchExampleTasksHandler() {
  try {
    yield delay(1000);
    const tasks = yield select(selectTasks);
    const exampleTasks = yield call(getExampleTasks);
    const date = formatCurrentDate(new Date());
    const exampleTasksWithDate = exampleTasks.map(task => ({ ...task, date }));
    yield put(setTasks({ tasks: exampleTasksWithDate, lastTasks: tasks }));
  } catch (error) {
    yield put(fetchError());
    yield delay(3000);
  } finally {
    yield put(resetFetchStatus());
  }
};

function* saveTasksInLocalStorageHandler() {
  const tasks = yield select(selectTasks);
  yield call(saveTasksInLocalStorage, tasks);
}
function* saveSettingsInLocalStorageHandler() {
  const [showSearch, hideDone] = yield all([
    select(selectShowSearch),
    select(selectHideDone)
  ]);
  yield call(saveSettingsInLocalStorage, { showSearch, hideDone });
};

export function* tasksSaga() {
  yield takeLatest(fetchExampleTasks.type, fetchExampleTasksHandler);
  yield takeLatest(
    [toggleShowSearch.type, toggleHideDone.type],
    saveSettingsInLocalStorageHandler
  );
  yield takeEvery("*", saveTasksInLocalStorageHandler);
};