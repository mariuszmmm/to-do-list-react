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
  taskMoveDown,
  taskMoveUp,
  toggleHideDone,
  toggleShowSearch,
  toggleTaskDone,
  undoTasks,
  clearTaskList,
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

// function* setListToLoadHandler(
//   action: ReturnType<typeof setListToLoad | typeof setArchivedListToLoad>
// ) {
//   let listToLoadData: {
//     id: string;
//     name: string;
//     date: string;
//     version: Version;
//     taskList: Task[];
//   } | null = null;

//   if (action.type === setListToLoad.type) {
//     const listToLoad: ReturnType<typeof selectListToLoad> = yield select(
//       selectListToLoad
//     );

//     if (!listToLoad) return;
//     listToLoadData = listToLoad;
//   } else if (action.type === setArchivedListToLoad.type) {
//     const archivedListToLoad = action.payload;
//     if (!archivedListToLoad) return;
//     listToLoadData = {
//       ...archivedListToLoad,
//       id: "",
//       taskList: archivedListToLoad.taskList.map((task) => ({
//         ...task,
//         id: nanoid(8),
//         updatedAt: new Date().toISOString(),
//       })),
//     };
//   } else return;

//   const tasks: ReturnType<typeof selectTasks> = yield select(selectTasks);
//   const taskListMetaData: ReturnType<typeof selectTaskListMetaData> =
//     yield select(selectTaskListMetaData);

//   let listName = listToLoadData.name;
//   let updatedAt = listToLoadData.date;
//   let tasksToLoad: Task[] = [...listToLoadData.taskList];

//   if (action.type === setArchivedListToLoad.type) {
//     yield put(
//       openModal({
//         title: { key: "modal.listLoad.title" },
//         message: { key: "modal.listLoad.message.confirm" },
//         type: "yes/no",
//       })
//     );

//     const { confirmed } = yield race({
//       confirmed: take(confirm),
//       cancelled: take(cancel),
//     });
//     if (confirmed) {
//       listName = taskListMetaData.name;
//       tasksToLoad.unshift(...tasks);
//     } else {
//       updatedAt = new Date().toISOString();
//       tasksToLoad = [
//         ...tasks.map((task) => ({ ...task, deleted: true })),
//         ...listToLoadData.taskList,
//       ];
//     }
//   }

//   yield put(
//     setTasks({
//       isLoad: true,
//       taskListMetaData: {
//         ...(listToLoadData.id
//           ? { id: listToLoadData.id }
//           : { id: taskListMetaData.id }),
//         name: listName,
//         date: listToLoadData.date,
//         updatedAt,
//       },
//       tasks: tasksToLoad,
//       stateForUndo: { tasks, taskListMetaData },
//     })
//   );

//   yield put(
//     openModal({
//       title: { key: "modal.listLoad.title" },
//       message: {
//         key: "modal.listLoad.message.info",
//         values: { name: listToLoadData.name },
//       },
//       type: "info",
//     })
//   );
// }

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

  let listName = listToLoadData.name;
  let updatedAt = listToLoadData.date;
  let tasksToLoad: Task[] = [...listToLoadData.taskList];

  if (isArchived) {
    yield put(
      openModal({
        title: { key: "modal.listLoad.title" },
        message: { key: "modal.listLoad.message.confirm" },
        type: "yes/no",
      })
    );

    const { confirmed } = yield race({
      confirmed: take(confirm),
      cancelled: take(cancel),
    });

    if (confirmed) {
      listName = taskListMetaData.name;
      tasksToLoad.unshift(...tasks);
    } else {
      updatedAt = new Date().toISOString();
      tasksToLoad = [
        ...tasks.map((task) => ({ ...task, deleted: true })),
        ...listToLoadData.taskList,
      ];
    }
  }

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

  if (!tasksToArchive) return;

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
      addArchivedList({
        name: tasksToArchive.name,
        tasks: tasksToArchive.tasks,
      })
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
      taskMoveUp.type,
      taskMoveDown.type,
    ],
    saveTasksInLocalStorageHandler
  );

  yield takeEvery(setTaskListToArchive.type, archiveTasksHandler);

  yield takeEvery(
    [setListToLoad.type, setArchivedListToLoad.type],
    setListToLoadHandler
  );
}
