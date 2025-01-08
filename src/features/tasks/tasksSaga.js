import { delay, call, put, select, takeLatest, takeEvery } from "redux-saga/effects";
import { setTasks, fetchError, resetFetchStatus, selectTasks, fetchExampleTasks } from "./tasksSlice";
import { getExampleTasks } from "./getExampleTasks";
import { saveTasksInLocalStorage } from "./tasksLocalStorage";
import { formatCurrentDate } from "../../utils/formatCurrentDate";


function* fetchExampleTasksHandler() {
  try {
    yield delay(1000);
    const exampleTasks = yield call(getExampleTasks);
    const date = formatCurrentDate(new Date());
    const tasks = exampleTasks.map(task => ({ ...task, date }));
    yield put(setTasks(tasks));
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

export function* tasksSaga() {
  yield takeLatest(fetchExampleTasks.type, fetchExampleTasksHandler);
  yield takeEvery("*", saveTasksInLocalStorageHandler);
};