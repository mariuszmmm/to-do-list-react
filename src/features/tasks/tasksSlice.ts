import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  getSettingsFromLocalStorage,
  getTasksFromLocalStorage,
  getListNameFromLocalStorage,
} from "../../utils/localStorage";
import { Task } from "../../types";
import { RootState } from "../../store";

interface TaskState {
  tasks: Task[];
  editedTask: Task | null;
  hideDone: boolean;
  showSearch: boolean;
  fetchStatus: "ready" | "loading" | "error";
  undoTasksStack: { tasks: Task[]; listName: string }[];
  redoTasksStack: { tasks: Task[]; listName: string }[];
  listName: string;
  listNameToEdit: string | null;
}

const InitialListName =
  getTasksFromLocalStorage().length > 0 && getListNameFromLocalStorage()
    ? getListNameFromLocalStorage()
    : "Nowa lista";

const initialState: TaskState = {
  tasks: getTasksFromLocalStorage(),
  editedTask: null,
  hideDone: getSettingsFromLocalStorage()?.hideDone || false,
  showSearch: getSettingsFromLocalStorage()?.showSearch || false,
  fetchStatus: "ready",
  undoTasksStack: [],
  redoTasksStack: [],
  listName: InitialListName,
  listNameToEdit: null,
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (
      state,
      {
        payload: { task, stateForUndo },
      }: PayloadAction<{
        task: Task;
        stateForUndo: { tasks: Task[]; listName: string };
      }>
    ) => {
      state.undoTasksStack.push(stateForUndo);
      state.tasks.push(task);
      state.redoTasksStack = [];
    },
    setTaskToEdit: (
      state,
      { payload: taskId }: PayloadAction<string | undefined>
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
        stateForUndo: { tasks: Task[]; listName: string };
      }>
    ) => {
      const index = state.tasks.findIndex((task) => task.id === id);
      if (index === -1) return;
      state.undoTasksStack.push(stateForUndo);
      state.tasks[index].content = content;
      state.tasks[index].editedDate = editedDate;
      state.editedTask = null;
      state.redoTasksStack = [];
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
        doneDate: Date | null;
        stateForUndo: { tasks: Task[]; listName: string };
      }>
    ) => {
      state.undoTasksStack.push(stateForUndo);
      const index = state.tasks.findIndex(({ id }) => id === taskId);
      state.tasks[index].done = !state.tasks[index].done;
      state.tasks[index].doneDate = state.tasks[index].done ? doneDate : null;
      state.redoTasksStack = [];
    },
    removeTasks: (
      state,
      {
        payload: { taskId, stateForUndo },
      }: PayloadAction<{
        taskId: string;
        stateForUndo: { tasks: Task[]; listName: string };
      }>
    ) => {
      const index = state.tasks.findIndex(({ id }) => id === taskId);
      if (index !== -1) {
        state.undoTasksStack.push(stateForUndo);
        state.tasks.splice(index, 1);
        state.redoTasksStack = [];
      }
    },
    setAllDone: (
      state,
      {
        payload: stateForUndo,
      }: PayloadAction<{ tasks: Task[]; listName: string }>
    ) => {
      state.undoTasksStack.push(stateForUndo);
      for (const task of state.tasks) {
        task.done = true;
      }
      state.redoTasksStack = [];
    },
    setAllUndone: (
      state,
      {
        payload: stateForUndo,
      }: PayloadAction<{ tasks: Task[]; listName: string }>
    ) => {
      state.undoTasksStack.push(stateForUndo);
      for (const task of state.tasks) {
        task.done = false;
      }
      state.redoTasksStack = [];
    },
    setTasks: (
      state,
      {
        payload: { tasks, listName, stateForUndo },
      }: PayloadAction<{
        tasks: Task[];
        listName: string;
        stateForUndo: { tasks: Task[]; listName: string };
      }>
    ) => {
      state.undoTasksStack.push(stateForUndo);
      state.tasks = tasks;
      state.listName = listName;
      state.redoTasksStack = [];
    },
    fetchExampleTasks: (state) => {
      state.fetchStatus = "loading";
    },
    resetFetchStatus: (state) => {
      state.fetchStatus = "ready";
    },
    fetchError: (state) => {
      state.fetchStatus = "error";
    },
    toggleShowSearch: (state) => {
      state.showSearch = !state.showSearch;
    },
    undoTasks: (state) => {
      state.redoTasksStack.push({
        tasks: state.tasks,
        listName: state.listName,
      });
      const undoTasksStack = state.undoTasksStack.pop();
      if (undoTasksStack === undefined) return;
      state.tasks = undoTasksStack.tasks;
      state.listName = undoTasksStack.listName;
    },
    redoTasks: (state) => {
      state.undoTasksStack.push({
        tasks: state.tasks,
        listName: state.listName,
      });
      const redoTasksStack = state.redoTasksStack.pop();
      if (redoTasksStack === undefined) return;
      state.tasks = redoTasksStack.tasks;
      state.listName = redoTasksStack.listName;
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
        payload: { listName, stateForUndo },
      }: PayloadAction<{
        listName: string;
        stateForUndo: { tasks: Task[]; listName: string };
      }>
    ) => {
      state.undoTasksStack.push(stateForUndo);
      state.listName = listName;
      state.redoTasksStack = [];
    },
    clearStorage: (state) => {
      state.tasks = [];
      state.editedTask = null;
      state.hideDone = false;
      state.showSearch = false;
      state.fetchStatus = "ready";
      state.undoTasksStack = [];
      state.redoTasksStack = [];
      state.listName = "Nowa lista";
      state.listNameToEdit = null;
    },
  },
});

export const {
  addTask,
  setTaskToEdit,
  saveEditedTask,
  toggleHideDone,
  toggleTaskDone,
  removeTasks,
  setAllDone,
  setAllUndone,
  fetchExampleTasks,
  resetFetchStatus,
  fetchError,
  setTasks,
  toggleShowSearch,
  undoTasks,
  redoTasks,
  setListNameToEdit,
  setListName,
  clearStorage,
} = tasksSlice.actions;

const selectTasksState = (state: RootState) => state.tasks;

export const selectTasks = (state: RootState) => selectTasksState(state).tasks;
export const selectEditedTask = (state: RootState) =>
  selectTasksState(state).editedTask;
export const selectHideDone = (state: RootState) =>
  selectTasksState(state).hideDone;
export const selectFetchStatus = (state: RootState) =>
  selectTasksState(state).fetchStatus;
export const selectShowSearch = (state: RootState) =>
  selectTasksState(state).showSearch;
export const selectUndoTasksStack = (state: RootState) =>
  selectTasksState(state).undoTasksStack;
export const selectRedoTasksStack = (state: RootState) =>
  selectTasksState(state).redoTasksStack;
export const selectListName = (state: RootState) =>
  selectTasksState(state).listName;
export const selectListNameToEdit = (state: RootState) =>
  selectTasksState(state).listNameToEdit;
export const selectAreTasksEmpty = (state: RootState) =>
  selectTasks(state).length === 0;
export const selectIsEveryTaskDone = (state: RootState) =>
  selectTasks(state).every(({ done }) => done);
export const selectIsEveryTaskUndone = (state: RootState) =>
  selectTasks(state).every(({ done }) => !done);
export const selectTaskById = (state: RootState, taskId: string) => {
  const task = selectTasks(state).find(({ id }) => id === taskId) || null;
  return task;
};

export const selectTasksByQuery = (state: RootState, query: string | null) => {
  const tasks = selectTasks(state);

  if (!query || query === "") return tasks;

  return tasks.filter(({ content }) =>
    content.toUpperCase().includes(query.toUpperCase().trim())
  );
};

export default tasksSlice.reducer;
