import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";
import {
  getSettingsFromLocalStorage,
  getTasksFromLocalStorage,
  getListMetadataFromLocalStorage,
  clearLocalStorage,
  getTimeFromLocalStorage,
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
  editedTask: Task | null;
  hideDone: boolean;
  showSearch: boolean;
  undoTasksStack: TaskListData[];
  undoLocked: boolean;
  redoTasksStack: TaskListData[];
  taskListMetaData: TaskListMetaData;
  time?: {
    lastChangeTime?: string;
    synchronizedTime?: string;
  };
  listNameToEdit: string | null;
  isTasksSorting: boolean;
  tasksToArchive: { listName: string; tasks: Task[] } | null;
  listStatus: {
    isRemoteSaveable?: boolean;
    isIdenticalToRemote?: boolean;
  };
  changeSource: ChangeSource;
}

const getInitialState = (): TaskState => ({
  tasks: getTasksFromLocalStorage() || [],
  editedTask: null,
  hideDone: getSettingsFromLocalStorage()?.hideDone || false,
  showSearch: getSettingsFromLocalStorage()?.showSearch || false,
  undoTasksStack: [],
  undoLocked: false,
  redoTasksStack: [],
  taskListMetaData: getListMetadataFromLocalStorage() || {
    id: nanoid(8),
    date: new Date().toISOString(),
    name: t("tasksPage.tasks.defaultListName"),
  },
  time: getTimeFromLocalStorage() || undefined,
  listNameToEdit: null,
  isTasksSorting: false,
  tasksToArchive: null,
  listStatus: {
    isRemoteSaveable: false,
    isIdenticalToRemote: false,
  },
  changeSource: null,
});

const tasksSlice = createSlice({
  name: "tasks",
  initialState: getInitialState(),
  reducers: {
    addTask: (
      state,
      {
        payload: { task, stateForUndo },
      }: PayloadAction<{
        task: Task;
        stateForUndo: TaskListData;
      }>
    ) => {
      const time = new Date().toISOString();
      state.undoTasksStack.push({
        ...stateForUndo,
        changeTime: time,
      });
      state.time = { ...state.time, lastChangeTime: time };
      state.tasks.push(task);
      state.redoTasksStack = [];
      if (!state.taskListMetaData.name) {
        state.taskListMetaData.name = t("tasksPage.tasks.defaultListName");
      }
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
      state.editedTask = { ...state.tasks[index] };
    },
    saveEditedTask: (
      state,
      {
        payload: {
          task: { id, content, editedDate },
          stateForUndo,
        },
      }: PayloadAction<{
        task: Task;
        stateForUndo: TaskListData;
      }>
    ) => {
      const index = state.tasks.findIndex((task) => task.id === id);
      if (index === -1) return;
      const time = new Date().toISOString();
      state.undoTasksStack.push({
        ...stateForUndo,
        changeTime: time,
      });
      state.time = { ...state.time, lastChangeTime: time };
      state.tasks[index].content = content;
      state.tasks[index].editedDate = editedDate;
      state.editedTask = null;
      state.redoTasksStack = [];
      state.changeSource = "local";
    },
    toggleHideDone: (state) => {
      state.hideDone = !state.hideDone;
    },
    toggleTaskDone: (
      state,
      {
        payload: { taskId, doneDate, stateForUndo },
      }: PayloadAction<{
        taskId: string;
        doneDate: string | null;
        stateForUndo: TaskListData;
      }>
    ) => {
      const time = new Date().toISOString();
      state.undoTasksStack.push({
        ...stateForUndo,
        changeTime: time,
      });
      state.time = { ...state.time, lastChangeTime: time };
      const index = state.tasks.findIndex(({ id }) => id === taskId);
      if (index !== -1) {
        state.tasks[index].done = !state.tasks[index].done;
        state.tasks[index].doneDate = state.tasks[index].done ? doneDate : null;
      }
      state.redoTasksStack = [];
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
      if (index !== -1) {
        const time = new Date().toISOString();
        state.undoTasksStack.push({
          ...stateForUndo,
          changeTime: time,
        });
        state.time = { ...state.time, lastChangeTime: time };
        state.tasks.splice(index, 1);
        state.redoTasksStack = [];
        state.changeSource = "local";
      }
    },
    setTaskListToArchive: (
      state,
      {
        payload: tasksToArchive,
      }: PayloadAction<{ tasks: Task[]; listName: string } | null>
    ) => {
      state.tasksToArchive = tasksToArchive;
    },
    clearTaskList: (state) => {
      const time = new Date().toISOString();
      state.undoTasksStack.push({
        tasks: state.tasks,
        taskListMetaData: state.taskListMetaData,
        changeTime: time,
      });
      state.time = { ...state.time, lastChangeTime: time };
      state.tasks = [];
      state.editedTask = null;
      state.taskListMetaData.id = nanoid(8);
      state.taskListMetaData.date = time;
      state.taskListMetaData.name = t("tasksPage.tasks.defaultListName");
      state.time = undefined;
      state.listNameToEdit = null;
      state.isTasksSorting = false;
      state.listStatus = {
        isRemoteSaveable: false,
        isIdenticalToRemote: false,
      };
      state.redoTasksStack = [];
      state.changeSource = "local";
    },
    setAllDone: (
      state,
      { payload: stateForUndo }: PayloadAction<TaskListData>
    ) => {
      const time = new Date().toISOString();
      state.undoTasksStack.push({
        ...stateForUndo,
        changeTime: time,
      });
      state.time = { ...state.time, lastChangeTime: time };
      for (const task of state.tasks) {
        task.done = true;
      }
      state.redoTasksStack = [];
      state.changeSource = "local";
    },
    setAllUndone: (
      state,
      { payload: stateForUndo }: PayloadAction<TaskListData>
    ) => {
      const time = new Date().toISOString();
      state.undoTasksStack.push({
        ...stateForUndo,
        changeTime: time,
      });
      state.time = { ...state.time, lastChangeTime: time };
      for (const task of state.tasks) {
        task.done = false;
      }
      state.redoTasksStack = [];
      state.changeSource = "local";
    },
    setTasks: (
      state,
      {
        payload: { taskListMetaData, tasks, stateForUndo },
      }: PayloadAction<{
        taskListMetaData: TaskListMetaData;
        tasks: Task[];
        stateForUndo: TaskListData | null;
      }>
    ) => {
      const time = new Date().toISOString();
      if (stateForUndo)
        state.undoTasksStack.push({
          ...stateForUndo,
          changeTime: time,
        });
      state.time = { ...state.time, lastChangeTime: time };
      state.taskListMetaData = taskListMetaData;
      state.tasks = tasks;
      state.redoTasksStack = [];
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
      if (undoTasksStack === undefined) return;
      state.tasks = undoTasksStack.tasks;
      state.taskListMetaData = undoTasksStack.taskListMetaData;
      state.changeSource = "local";
    },
    redoTasks: (state) => {
      state.undoTasksStack.push({
        tasks: state.tasks,
        taskListMetaData: state.taskListMetaData,
        changeTime: new Date().toISOString(),
      });
      const redoTasksStack = state.redoTasksStack.pop();
      if (redoTasksStack === undefined) return;
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
    setListMetadata: (
      state,
      {
        payload: { taskListMetaData, stateForUndo },
      }: PayloadAction<{
        taskListMetaData: TaskListMetaData;
        stateForUndo: TaskListData;
      }>
    ) => {
      const time = new Date().toISOString();
      state.undoTasksStack.push({
        ...stateForUndo,
        changeTime: time,
      });
      state.time = { ...state.time, lastChangeTime: time };
      state.taskListMetaData = taskListMetaData;
      state.redoTasksStack = [];
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
          return selectedTask;
        }
        if (i === index) {
          return prevTask;
        }
        return task;
      });
      state.changeSource = "local";
    },
    taskMoveDown: (state, { payload: index }) => {
      let tasks = [...state.tasks];
      const selectedTask = tasks[index];
      const nextTask = tasks[index + 1];

      if (!selectedTask || !nextTask) return;

      state.tasks = tasks.map((tasks, i) => {
        if (i === index) {
          return nextTask;
        }
        if (i === index + 1) {
          return selectedTask;
        }
        return tasks;
      });
      state.changeSource = "local";
    },
    switchTaskSort: (state) => {
      if (!state.isTasksSorting) {
        state.undoTasksStack.push({
          tasks: state.tasks,
          taskListMetaData: state.taskListMetaData,
          changeTime: new Date().toISOString(),
        });
      } else {
        state.redoTasksStack = [];
      }
      state.isTasksSorting = !state.isTasksSorting;
    },
    clearStorage: () => {
      clearLocalStorage();
      return getInitialState();
    },
    setChangeSource: (state, { payload }: PayloadAction<ChangeSource>) => {
      state.changeSource = payload;
    },
    setSynchronizeTime: (
      state,
      {
        payload: { synchronizedTime, tasks },
      }: PayloadAction<{
        synchronizedTime: string;
        tasks: Task[];
      }>
    ) => {
      state.time = { ...state.time, synchronizedTime };
      state.tasks = tasks.map((task) => ({
        ...task,
        synchronized: true,
      }));
    },
    setUndoLocked: (state, { payload }: PayloadAction<boolean>) => {
      state.undoLocked = payload;
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
  setListMetadata,
  setListStatus,
  taskMoveUp,
  taskMoveDown,
  switchTaskSort,
  clearStorage,
  setChangeSource,
  setSynchronizeTime,
  setUndoLocked,
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
export const selectTime = (state: RootState) => selectTasksState(state).time;
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
export const selectUndoLocked = (state: RootState) =>
  selectTasksState(state).undoLocked;

export default tasksSlice.reducer;
