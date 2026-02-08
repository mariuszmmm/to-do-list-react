import { createSelector, createSlice, current, nanoid, PayloadAction } from "@reduxjs/toolkit";
import {
  getSettingsFromLocalStorage,
  getTasksFromLocalStorage,
  getListMetadataFromLocalStorage,
  clearLocalStorage,
} from "../../utils/localStorage";
import { TaskListMetaData, Task, TaskListData, ChangeSource, EditedTask } from "../../types";
import { RootState } from "../../store";
import { t } from "i18next";
import i18n from "../../utils/i18n";
import { getListMetadataFromSessionStorage, getTasksFromSessionStorage } from "../../utils/sessionStorage";

interface TaskState {
  tasks: Task[];
  editedTask?: EditedTask;
  hideDone: boolean;
  showSearch: boolean;
  undoTasksStack: TaskListData[];
  redoTasksStack: TaskListData[];
  taskListMetaData: TaskListMetaData;
  listNameToEdit?: string | null;
  isTasksSorting: boolean;
  tasksToSort: Task[] | null;
  tasksToArchive?: { name: string; tasks: Task[] } | null;
  listStatus: {
    manualSaveTriggered: boolean;
    isRemoteSaveable: boolean;
    isIdenticalToRemote: boolean;
  };
  changeSource?: ChangeSource;
}

const getNewTaskListMetaData = () => ({
  id: nanoid(),
  name: i18n.t("tasksPage.tasks.defaultListName") || "________",
  date: initTime,
  updatedAt: initTime,
  synced: false,
});

const initTime = new Date().toISOString();
const getInitialState = (): TaskState => ({
  tasks: getTasksFromLocalStorage() || getTasksFromSessionStorage() || [],
  hideDone: getSettingsFromLocalStorage()?.hideDone || false,
  showSearch: getSettingsFromLocalStorage()?.showSearch || false,
  undoTasksStack: [],
  redoTasksStack: [],
  taskListMetaData:
    getListMetadataFromLocalStorage() || getListMetadataFromSessionStorage() || getNewTaskListMetaData(),
  isTasksSorting: false,
  tasksToSort: null,
  listStatus: {
    manualSaveTriggered: false,
    isRemoteSaveable: false,
    isIdenticalToRemote: false,
  },
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
      }>,
    ) => {
      const time = new Date().toISOString();
      state.undoTasksStack.push(stateForUndo);
      state.redoTasksStack = [];
      state.tasks.push({
        id: nanoid(),
        content,
        done: false,
        date: time,
        updatedAt: time,
        status: "new",
      });
      state.taskListMetaData = { ...state.taskListMetaData, updatedAt: time };
      state.changeSource = "local";
    },
    setTaskToEdit: (state, { payload: taskId }: PayloadAction<string | null>) => {
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
      }>,
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
        status: "edited",
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
      }>,
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
        status: "updated",
      };
      state.taskListMetaData = { ...state.taskListMetaData, updatedAt: time };
      state.changeSource = "local";
    },
    removeTask: (
      state,
      {
        payload: { taskId, stateForUndo, isRemoteSaveable },
      }: PayloadAction<{
        taskId: string;
        stateForUndo: TaskListData;
        isRemoteSaveable?: boolean;
      }>,
    ) => {
      const index = state.tasks.findIndex(({ id }) => id === taskId);
      if (index === -1) return;
      const time = new Date().toISOString();
      // !isRemoteSaveable && state.undoTasksStack.push(stateForUndo);
      state.undoTasksStack.push(stateForUndo);

      state.redoTasksStack = [];
      isRemoteSaveable
        ? (state.tasks[index] = {
            ...state.tasks[index],
            updatedAt: time,
            status: "deleted",
          })
        : state.tasks.splice(index, 1);
      state.taskListMetaData = { ...state.taskListMetaData, updatedAt: time };
      state.changeSource = "local";
    },
    setTaskListToArchive: (
      state,
      { payload: tasksToArchive }: PayloadAction<{ name: string; tasks: Task[] } | null>,
    ) => {
      const tasks =
        tasksToArchive?.tasks
          .filter((task) => task.status !== "deleted")
          .map((task) => ({
            id: task.id,
            content: task.content,
            done: task.done,
            date: task.date,
            updatedAt: task.updatedAt,
          })) || [];
      state.tasksToArchive = tasksToArchive ? { name: tasksToArchive.name, tasks } : null;
    },
    clearTaskList: (state, { payload: stateForUndo }: PayloadAction<TaskListData>) => {
      const time = new Date().toISOString();
      state.undoTasksStack.push(stateForUndo);
      state.redoTasksStack = [];
      state.tasks = [];
      state.editedTask = null;
      state.taskListMetaData = {
        id: nanoid(),
        name: t("tasksPage.tasks.defaultListName"),
        date: time,
        updatedAt: time,
        synced: false,
      };
      state.listNameToEdit = null;
      state.isTasksSorting = false;
      state.tasksToArchive = null;
      state.listStatus = {
        manualSaveTriggered: false,
        isRemoteSaveable: false,
        isIdenticalToRemote: false,
      };
      state.changeSource = "local";
    },
    setAllDone: (state, { payload: stateForUndo }: PayloadAction<TaskListData>) => {
      if (state.tasks.length === 0 || state.tasks.every(({ done }) => done)) return;
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
    setAllUndone: (state, { payload: stateForUndo }: PayloadAction<TaskListData>) => {
      if (state.tasks.length === 0 || state.tasks.every(({ done }) => !done)) return;
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
        payload: { isLoad, taskListMetaData, tasks, stateForUndo },
      }: PayloadAction<{
        isLoad?: boolean;
        taskListMetaData: TaskListMetaData;
        tasks: Task[];
        stateForUndo?: TaskListData;
      }>,
    ) => {
      const time = new Date().toISOString();
      if (stateForUndo) {
        state.undoTasksStack.push(stateForUndo);
        state.redoTasksStack = [];
      }
      state.tasks = isLoad
        ? tasks
        : tasks.map((task) => ({
            ...task,
            updatedAt: time,
          }));
      state.taskListMetaData = isLoad ? taskListMetaData : { ...taskListMetaData, updatedAt: time };
      state.changeSource = "local";
    },
    toggleShowSearch: (state) => {
      state.showSearch = !state.showSearch;
    },
    undoTasks: (state) => {
      const time = new Date().toISOString();
      state.redoTasksStack.push({
        tasks: state.tasks,
        taskListMetaData: state.taskListMetaData,
      });
      const undoTasksStack = state.undoTasksStack.pop();
      if (!undoTasksStack) return;
      state.tasks = undoTasksStack.tasks.map((task) => ({
        ...task,
        status: "updated",
        updatedAt: time,
      }));
      state.taskListMetaData = {
        ...undoTasksStack.taskListMetaData,
        updatedAt: time,
      };
      state.changeSource = "local";
    },
    redoTasks: (state) => {
      const time = new Date().toISOString();
      state.undoTasksStack.push({
        tasks: state.tasks,
        taskListMetaData: state.taskListMetaData,
      });
      const redoTasksStack = state.redoTasksStack.pop();
      if (!redoTasksStack) return;
      state.tasks = redoTasksStack.tasks.map((task) => ({
        ...task,
        updatedAt: time,
      }));
      state.taskListMetaData = {
        ...redoTasksStack.taskListMetaData,
        updatedAt: time,
      };
      state.changeSource = "local";
    },
    setListNameToEdit: (state, { payload: listNameToEdit }: PayloadAction<string | null>) => {
      if (listNameToEdit) {
        state.listNameToEdit = listNameToEdit;
      } else {
        state.listNameToEdit = null;
      }
    },
    setListName: (
      state,
      { payload: { name, stateForUndo } }: PayloadAction<{ name: string; stateForUndo?: TaskListData }>,
    ) => {
      const time = new Date().toISOString();
      if (!!stateForUndo) {
        state.undoTasksStack.push(stateForUndo);
        state.redoTasksStack = [];
      }
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
        payload: { manualSaveTriggered, isRemoteSaveable, isIdenticalToRemote },
      }: PayloadAction<{
        manualSaveTriggered?: boolean;
        isRemoteSaveable?: boolean;
        isIdenticalToRemote?: boolean;
      }>,
    ) => {
      if (manualSaveTriggered !== undefined) {
        state.listStatus.manualSaveTriggered = manualSaveTriggered;
      }
      if (isRemoteSaveable !== undefined) {
        state.listStatus.isRemoteSaveable = isRemoteSaveable;
      }
      if (isIdenticalToRemote !== undefined) {
        state.listStatus.isIdenticalToRemote = isIdenticalToRemote;
      }
    },
    updateTasksStatus: (state, { payload: { status } }: PayloadAction<{ status: Task["status"] }>) => {
      if (!status) return;
      const allTasks = state.tasks;
      const isAll = allTasks.every((task) => task.status === status);
      if (isAll) return;

      const tasksWithStatus = allTasks.map((task) => ({ ...task, status }));
      state.tasks = tasksWithStatus;
    },
    setTasksToSort: (state, { payload: sortedTasks }: PayloadAction<Task[] | null>) => {
      state.tasksToSort = sortedTasks;
    },
    switchTasksSort: (state) => {
      state.isTasksSorting = !state.isTasksSorting;
    },
    clearStorage: () => {
      clearLocalStorage();
      return getInitialState();
    },
    setChangeSource: (state, { payload }: PayloadAction<ChangeSource>) => {
      state.changeSource = payload;
    },
    setImage: (
      state,
      {
        payload: { taskId, image },
      }: PayloadAction<{
        taskId: string;
        image: Task["image"];
      }>,
    ) => {
      console.log("taskId", taskId, "image", image);
      const index = state.tasks.findIndex((task) => task.id === taskId);
      if (index === -1) return;
      const time = new Date().toISOString();
      state.tasks[index] = {
        ...state.tasks[index],
        updatedAt: time,
        image,
      };
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
  updateTasksStatus,
  setTasksToSort,
  switchTasksSort,
  clearStorage,
  setChangeSource,
  setImage,
} = tasksSlice.actions;

const selectTasksState = (state: RootState) => state.tasks;

export const selectTasks = (state: RootState) => selectTasksState(state).tasks;
export const selectEditedTask = (state: RootState) => selectTasksState(state).editedTask;
export const selectHideDone = (state: RootState) => selectTasksState(state).hideDone;
export const selectShowSearch = (state: RootState) => selectTasksState(state).showSearch;
export const selectUndoTasksStack = (state: RootState) => selectTasksState(state).undoTasksStack;
export const selectRedoTasksStack = (state: RootState) => selectTasksState(state).redoTasksStack;
export const selectTaskListMetaData = (state: RootState) => selectTasksState(state).taskListMetaData;
export const selectListNameToEdit = (state: RootState) => selectTasksState(state).listNameToEdit;
export const selectAreTasksEmpty = (state: RootState) => selectTasks(state).length === 0;
export const selectIsEveryTaskDone = (state: RootState) => selectTasks(state).every(({ done }) => done);
export const selectIsEveryTaskUndone = (state: RootState) => selectTasks(state).every(({ done }) => !done);
export const selectTaskById = (state: RootState, taskId: string) =>
  selectTasks(state).find(({ id }) => id === taskId) || null;
export const selectTasksToArchive = (state: RootState) => selectTasksState(state).tasksToArchive;
export const selectListStatus = (state: RootState) => selectTasksState(state).listStatus;
export const selectTasksToSort = (state: RootState) => selectTasksState(state).tasksToSort;
export const selectIsTasksSorting = (state: RootState) => selectTasksState(state).isTasksSorting;
export const selectActiveTasksByQuery = createSelector(
  [selectTasks, (_: RootState, query: string | null) => query],
  (tasks, query) => {
    const filtered = tasks.filter((task) => task.status !== "deleted");
    if (!query) return filtered;
    return filtered.filter((task) => task.content.toUpperCase().includes(query.toUpperCase().trim()));
  },
);
export const selectChangeSource = (state: RootState) => selectTasksState(state).changeSource;

export default tasksSlice.reducer;
