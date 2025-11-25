import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";
import {
  getSettingsFromLocalStorage,
  getTasksFromLocalStorage,
  getListMetadataFromLocalStorage,
  clearLocalStorage,
  getLastSyncedAtFromLocalStorage,
} from "../../utils/localStorage";
import {
  TaskListMetaData,
  Task,
  TaskListData,
  ChangeSource,
} from "../../types";
import { RootState } from "../../store";
import { t } from "i18next";

interface TaskState {
  tasks: Task[];
  editedTask?: { id: string; content: string } | null;
  hideDone: boolean;
  showSearch: boolean;
  undoTasksStack: TaskListData[];
  redoTasksStack: TaskListData[];
  taskListMetaData: TaskListMetaData;
  lastSyncedAt?: string;
  listNameToEdit?: string | null;
  isTasksSorting: boolean;
  tasksToArchive: { name: string; tasks: Task[] } | null;
  listStatus: {
    isRemoteSaveable?: boolean;
    isIdenticalToRemote?: boolean;
  };
  changeSource?: ChangeSource;
}

const time = new Date().toISOString();
const getInitialState = (): TaskState => ({
  tasks: getTasksFromLocalStorage() || [],
  hideDone: getSettingsFromLocalStorage()?.hideDone || false,
  showSearch: getSettingsFromLocalStorage()?.showSearch || false,
  undoTasksStack: [],
  redoTasksStack: [],
  taskListMetaData: getListMetadataFromLocalStorage() || {
    id: nanoid(8),
    name: t("tasksPage.tasks.defaultListName"),
    date: time,
    updatedAt: time,
  },
  lastSyncedAt: getLastSyncedAtFromLocalStorage(),
  isTasksSorting: false,
  tasksToArchive: null,
  listStatus: {},
});

const tasksSlice = createSlice({
  name: "tasks",
  initialState: getInitialState(),
  reducers: {
    addTask: (
      state,
      {
        payload: { content, stateForUndo },
      }: PayloadAction<{
        content: string;
        stateForUndo: TaskListData;
      }>
    ) => {
      const time = new Date().toISOString();
      state.undoTasksStack.push(stateForUndo);
      state.redoTasksStack = [];
      state.tasks.push({
        id: nanoid(8),
        content,
        done: false,
        date: time,
        updatedAt: time,
      });
      state.taskListMetaData = { ...state.taskListMetaData, updatedAt: time };
      state.changeSource = "local";
    },
    setTaskToEdit: (
      state,
      { payload: taskId }: PayloadAction<string | null>
    ) => {
      if (!taskId) {
        state.editedTask = null;
        return;
      }
      const index = state.tasks.findIndex((task) => task.id === taskId);
      if (index === -1) return;
      state.editedTask = {
        id: state.tasks[index].id,
        content: state.tasks[index].content,
      };
    },
    saveEditedTask: (
      state,
      {
        payload: { id, content, stateForUndo },
      }: PayloadAction<{
        id: string;
        content: string;
        stateForUndo: TaskListData;
      }>
    ) => {
      const index = state.tasks.findIndex((task) => task.id === id);
      if (index === -1) return;
      const time = new Date().toISOString();
      state.undoTasksStack.push(stateForUndo);
      state.redoTasksStack = [];
      state.tasks[index] = {
        ...state.tasks[index],
        content,
        editedAt: time,
        updatedAt: time,
      };
      state.taskListMetaData = { ...state.taskListMetaData, updatedAt: time };
      state.editedTask = null;
      state.changeSource = "local";
    },
    toggleHideDone: (state) => {
      state.hideDone = !state.hideDone;
    },
    toggleTaskDone: (
      state,
      {
        payload: { taskId, stateForUndo },
      }: PayloadAction<{
        taskId: string;
        stateForUndo: TaskListData;
      }>
    ) => {
      const index = state.tasks.findIndex(({ id }) => id === taskId);
      if (index === -1) return;
      const time = new Date().toISOString();
      state.undoTasksStack.push(stateForUndo);
      state.redoTasksStack = [];
      const { done } = state.tasks[index];
      state.tasks[index] = {
        ...state.tasks[index],
        done: !done,
        completedAt: done ? null : time,
        updatedAt: time,
      };
      state.taskListMetaData = { ...state.taskListMetaData, updatedAt: time };
      state.changeSource = "local";
    },
    removeTask: (
      state,
      {
        payload: { taskId, stateForUndo },
      }: PayloadAction<{
        taskId: string;
        stateForUndo: TaskListData;
      }>
    ) => {
      const index = state.tasks.findIndex(({ id }) => id === taskId);
      if (index === -1) return;
      const time = new Date().toISOString();
      state.undoTasksStack.push(stateForUndo);
      state.redoTasksStack = [];
      state.tasks[index] = {
        ...state.tasks[index],
        deleted: true,
        updatedAt: time,
      };
      state.taskListMetaData = { ...state.taskListMetaData, updatedAt: time };
      state.changeSource = "local";
    },
    setTaskListToArchive: (
      state,
      {
        payload: tasksToArchive,
      }: PayloadAction<{ name: string; tasks: Task[] } | null>
    ) => {
      state.tasksToArchive = tasksToArchive;
    },
    clearTaskList: (
      state,
      { payload: stateForUndo }: PayloadAction<TaskListData>
    ) => {
      const time = new Date().toISOString();
      state.undoTasksStack.push(stateForUndo);
      state.redoTasksStack = [];
      state.tasks = [];
      state.editedTask = null;
      state.taskListMetaData = {
        id: nanoid(8),
        name: t("tasksPage.tasks.defaultListName"),
        date: time,
        updatedAt: time,
      };
      state.lastSyncedAt = undefined;
      state.listNameToEdit = null;
      state.isTasksSorting = false;
      state.tasksToArchive = null;
      state.listStatus = {};
      state.changeSource = "local";
    },
    setAllDone: (
      state,
      { payload: stateForUndo }: PayloadAction<TaskListData>
    ) => {
      if (state.tasks.length === 0 || state.tasks.every(({ done }) => done))
        return;
      const time = new Date().toISOString();
      state.undoTasksStack.push(stateForUndo);
      state.redoTasksStack = [];
      for (const task of state.tasks) {
        task.done = true;
        task.completedAt = time;
        task.updatedAt = time;
      }
      state.taskListMetaData = { ...state.taskListMetaData, updatedAt: time };
      state.changeSource = "local";
    },
    setAllUndone: (
      state,
      { payload: stateForUndo }: PayloadAction<TaskListData>
    ) => {
      if (state.tasks.length === 0 || state.tasks.every(({ done }) => !done))
        return;
      const time = new Date().toISOString();
      state.undoTasksStack.push(stateForUndo);
      state.redoTasksStack = [];
      for (const task of state.tasks) {
        task.done = false;
        task.completedAt = null;
        task.updatedAt = time;
      }
      state.taskListMetaData = { ...state.taskListMetaData, updatedAt: time };
      state.changeSource = "local";
    },
    setTasks: (
      state,
      {
        payload: { taskListMetaData, tasks, stateForUndo },
      }: PayloadAction<{
        taskListMetaData: TaskListMetaData;
        tasks: Task[];
        stateForUndo: TaskListData;
      }>
    ) => {
      const time = new Date().toISOString();
      state.undoTasksStack.push(stateForUndo);
      state.redoTasksStack = [];
      state.tasks = tasks.map((task) => ({
        ...task,
        updatedAt: time,
      }));
      state.taskListMetaData = { ...taskListMetaData, updatedAt: time };
      state.changeSource = "local";
    },
    toggleShowSearch: (state) => {
      state.showSearch = !state.showSearch;
    },
    undoTasks: (state) => {
      state.redoTasksStack.push({
        tasks: state.tasks,
        taskListMetaData: state.taskListMetaData,
      });
      const undoTasksStack = state.undoTasksStack.pop();
      if (!undoTasksStack) return;
      state.tasks = undoTasksStack.tasks;
      state.taskListMetaData = undoTasksStack.taskListMetaData;
      state.changeSource = "local";
    },
    redoTasks: (state) => {
      state.undoTasksStack.push({
        tasks: state.tasks,
        taskListMetaData: state.taskListMetaData,
      });
      const redoTasksStack = state.redoTasksStack.pop();
      if (!redoTasksStack) return;
      state.tasks = redoTasksStack.tasks;
      state.taskListMetaData = redoTasksStack.taskListMetaData;
      state.changeSource = "local";
    },
    setListNameToEdit: (
      state,
      { payload: listNameToEdit }: PayloadAction<string | null>
    ) => {
      if (listNameToEdit) {
        state.listNameToEdit = listNameToEdit;
      } else {
        state.listNameToEdit = null;
      }
    },
    setListName: (
      state,
      {
        payload: { name, stateForUndo },
      }: PayloadAction<{ name: string; stateForUndo: TaskListData }>
    ) => {
      const time = new Date().toISOString();
      state.undoTasksStack.push(stateForUndo);
      state.redoTasksStack = [];
      state.taskListMetaData = {
        ...state.taskListMetaData,
        name,
        updatedAt: time,
      };
      state.changeSource = "local";
    },
    setListStatus: (
      state,
      {
        payload: { isRemoteSaveable, isIdenticalToRemote },
      }: PayloadAction<{
        isRemoteSaveable?: boolean;
        isIdenticalToRemote?: boolean;
      }>
    ) => {
      state.listStatus = {
        isRemoteSaveable: isRemoteSaveable || false,
        isIdenticalToRemote: isIdenticalToRemote || false,
      };
    },
    taskMoveUp: (state, { payload: index }) => {
      let tasks = [...state.tasks];
      const selectedTask = tasks[index];
      const prevTask = tasks[index - 1];

      if (!selectedTask || !prevTask) return;

      state.tasks = tasks.map((task, i) => {
        if (i === index - 1) {
          return { ...selectedTask, updatedAt: time };
        }
        if (i === index) {
          return { ...prevTask, updatedAt: time };
        }
        return task;
      });
      state.taskListMetaData = { ...state.taskListMetaData, updatedAt: time };
      state.changeSource = "local";
    },
    taskMoveDown: (state, { payload: index }) => {
      let tasks = [...state.tasks];
      const selectedTask = tasks[index];
      const nextTask = tasks[index + 1];

      if (!selectedTask || !nextTask) return;

      state.tasks = tasks.map((task, i) => {
        if (i === index) {
          return { ...nextTask, updatedAt: time };
        }
        if (i === index + 1) {
          return { ...selectedTask, updatedAt: time };
        }
        return task;
      });
      state.taskListMetaData = { ...state.taskListMetaData, updatedAt: time };
      state.changeSource = "local";
    },
    switchTaskSort: (state) => {
      state.isTasksSorting = !state.isTasksSorting;
    },
    clearStorage: () => {
      clearLocalStorage();
      return getInitialState();
    },
    setChangeSource: (state, { payload }: PayloadAction<ChangeSource>) => {
      state.changeSource = payload;
    },
    setLastSyncedAt: (state) => {
      const time = new Date().toISOString();
      state.lastSyncedAt = time;
    },
  },
});

export const {
  addTask,
  setTaskToEdit,
  saveEditedTask,
  toggleHideDone,
  toggleTaskDone,
  removeTask,
  setTaskListToArchive,
  clearTaskList,
  setAllDone,
  setAllUndone,
  setTasks,
  toggleShowSearch,
  undoTasks,
  redoTasks,
  setListNameToEdit,
  setListName,
  setListStatus,
  taskMoveUp,
  taskMoveDown,
  switchTaskSort,
  clearStorage,
  setChangeSource,
  setLastSyncedAt,
} = tasksSlice.actions;

const selectTasksState = (state: RootState) => state.tasks;

export const selectTasks = (state: RootState) => selectTasksState(state).tasks;
export const selectEditedTask = (state: RootState) =>
  selectTasksState(state).editedTask;
export const selectHideDone = (state: RootState) =>
  selectTasksState(state).hideDone;
export const selectShowSearch = (state: RootState) =>
  selectTasksState(state).showSearch;
export const selectUndoTasksStack = (state: RootState) =>
  selectTasksState(state).undoTasksStack;
export const selectRedoTasksStack = (state: RootState) =>
  selectTasksState(state).redoTasksStack;
export const selectTaskListMetaData = (state: RootState) =>
  selectTasksState(state).taskListMetaData;
export const selectLastSyncedAt = (state: RootState) =>
  selectTasksState(state).lastSyncedAt;
export const selectListNameToEdit = (state: RootState) =>
  selectTasksState(state).listNameToEdit;
export const selectAreTasksEmpty = (state: RootState) =>
  selectTasks(state).length === 0;
export const selectIsEveryTaskDone = (state: RootState) =>
  selectTasks(state).every(({ done }) => done);
export const selectIsEveryTaskUndone = (state: RootState) =>
  selectTasks(state).every(({ done }) => !done);
export const selectTaskById = (state: RootState, taskId: string) =>
  selectTasks(state).find(({ id }) => id === taskId) || null;
export const selectTasksToArchive = (state: RootState) =>
  selectTasksState(state).tasksToArchive;
export const selectListStatus = (state: RootState) =>
  selectTasksState(state).listStatus;
export const selectIsTasksSorting = (state: RootState) =>
  selectTasksState(state).isTasksSorting;
export const selectTasksByQuery = (state: RootState, query: string | null) => {
  const tasks = selectTasks(state);
  if (!query || query === "") return tasks;
  return tasks.filter(({ content }) =>
    content.toUpperCase().includes(query.toUpperCase().trim())
  );
};
export const selectChangeSource = (state: RootState) =>
  selectTasksState(state).changeSource;

export default tasksSlice.reducer;
