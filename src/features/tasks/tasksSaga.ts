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
  toggleHideDone,
  toggleShowSearch,
  toggleTaskDone,
  undoTasks,
  clearTaskList,
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
import { Task, Version } from "../../types";
import { nanoid } from "nanoid";

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
  const isArchived = action.type === setArchivedListToLoad.type;
  let listToLoadData: {
    id: string;
    name: string;
    date: string;
    version: Version;
    taskList: Task[];
  } | null = null;

  if (isArchived) {
    const archivedListToLoad = action.payload;
    if (!archivedListToLoad) return;
    listToLoadData = {
      ...archivedListToLoad,
      id: "",
      taskList: archivedListToLoad.taskList.map((task) => ({
        ...task,
        id: nanoid(8),
        updatedAt: new Date().toISOString(),
      })),
    };
  } else {
    const listToLoad: ReturnType<typeof selectListToLoad> = yield select(
      selectListToLoad
    );
    if (!listToLoad) return;
    listToLoadData = listToLoad;
  }

  const tasks: ReturnType<typeof selectTasks> = yield select(selectTasks);
  const taskListMetaData: ReturnType<typeof selectTaskListMetaData> =
    yield select(selectTaskListMetaData);
  const { isRemoteSaveable }: ReturnType<typeof selectListStatus> =
    yield select(selectListStatus);

  let listName = listToLoadData.name;
  let updatedAt: string;
  let tasksToLoad: Task[];

  if (isArchived) {
    updatedAt = new Date().toISOString();
    tasksToLoad = isRemoteSaveable
      ? [
          ...tasks.map((task) => ({ ...task, deleted: true })),
          ...listToLoadData.taskList,
        ]
      : [...listToLoadData.taskList];
  } else {
    updatedAt = listToLoadData.date;
    tasksToLoad = [...listToLoadData.taskList];
  }

  yield archiveTasksHandler();

  yield put(
    setTasks({
      isLoad: true,
      taskListMetaData: {
        ...(listToLoadData.id
          ? { id: listToLoadData.id }
          : { id: taskListMetaData.id }),
        name: listName,
        date: listToLoadData.date,
        updatedAt,
      },
      tasks: tasksToLoad,
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
}

function* archiveTasksHandler() {
  const tasksToArchive: ReturnType<typeof selectTasksToArchive> = yield select(
    selectTasksToArchive
  );
  const tasks: ReturnType<typeof selectTasks> = yield select(selectTasks);
  const taskListMetaData: ReturnType<typeof selectTaskListMetaData> =
    yield select(selectTaskListMetaData);

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
      addArchivedList(
        tasksToArchive
          ? {
              name: tasksToArchive.name,
              tasks: tasksToArchive.tasks,
            }
          : {
              name: taskListMetaData.name,
              tasks: tasks.filter((task) => !task.deleted),
            }
      )
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
    ],
    saveTasksInLocalStorageHandler
  );

  yield takeEvery(setTaskListToArchive.type, archiveTasksHandler);

  yield takeEvery(
    [setListToLoad.type, setArchivedListToLoad.type],
    setListToLoadHandler
  );
}
