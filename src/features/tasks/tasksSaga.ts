import {
  call,
  delay,
  put,
  select,
  takeEvery,
  takeLatest,
} from "redux-saga/effects";
import { getExampleTasks } from "../../api/getExampleTasks";
import {
  saveListNameInLocalStorage,
  saveSettingsInLocalStorage,
  saveTasksInLocalStorage,
} from "../../utils/localStorage";
import { Task } from "../../types";
import {
  addTask,
  fetchError,
  fetchExampleTasks,
  redoTasks,
  removeTasks,
  resetFetchStatus,
  saveEditedTask,
  selectHideDone,
  selectListName,
  selectShowSearch,
  selectTasks,
  setAllDone,
  setAllUndone,
  setListName,
  setTasks,
  toggleHideDone,
  toggleShowSearch,
  toggleTaskDone,
  undoTasks,
} from "./tasksSlice";
import { selectListToLoad, setListToLoad } from "../ListsPage/listsSlice";
import { openModal } from "../../Modal/modalSlice";

function* fetchExampleTasksHandler() {
  try {
    yield delay(1000);
    const tasks: ReturnType<typeof selectTasks> = yield select(selectTasks);
    const listName: ReturnType<typeof selectListName> = yield select(
      selectListName
    );
    const exampleTasks: Task[] = yield call(getExampleTasks);
    const date = new Date().toISOString();

    const exampleTasksWithDate = exampleTasks.map((task) => ({
      ...task,
      date,
    }));
    yield put(
      setTasks({
        tasks: exampleTasksWithDate,
        listName: "Przykładowe zadania",
        stateForUndo: {
          tasks,
          listName,
        },
      })
    );
  } catch (error) {
    yield put(fetchError());
    yield delay(3000);
  } finally {
    yield put(resetFetchStatus());
  }
}

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
      title: { key: "modal.loadList.title" },
      message: {
        key: "modal.loadList.message.info",
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
      redoTasks.type,
    ],
    saveDataInLocalStorageHandler
  );
  yield takeEvery(setListToLoad.type, setListToLoadHandler);
}
