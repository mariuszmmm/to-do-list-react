import { createSlice } from "@reduxjs/toolkit";
import { getSettingsFromLocalStorage, getTasksFromLocalStorage, getListNameFromLocalStorage } from "../../utils/localStorage";

const tasksSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: getTasksFromLocalStorage(),
    editedTask: null,
    hideDone: getSettingsFromLocalStorage()?.hideDone,
    showSearch: getSettingsFromLocalStorage()?.showSearch,
    fetchStatus: "ready",
    undoStack: [],
    redoStack: [],
    listName: getListNameFromLocalStorage() || "Nowa lista",
    editListName: false,
  },
  reducers: {
    addTask: (state, { payload: { task, lastTasks } }) => {
      state.undoStack.push([...lastTasks]);
      state.tasks.push(task);
      state.redoStack = [];
    },
    editTask: (state, { payload: taskId }) => {
      const index = state.tasks.findIndex(task => task.id === taskId);
      state.editedTask = taskId ? state.tasks[index] : null;
    },
    saveEditedTask: (state, { payload: { task: { id, content, editedDate }, lastTasks } }) => {
      state.undoStack.push([...lastTasks]);
      const index = state.tasks.findIndex(task => task.id === id);
      state.tasks[index].content = content;
      state.tasks[index].editedDate = editedDate;
      state.editedTask = null;
      state.redoStack = [];
    },
    toggleHideDone: state => {
      state.hideDone = !state.hideDone;
    },
    toggleTaskDone: (state, { payload: { taskId, doneDate, lastTasks } }) => {
      state.undoStack.push([...lastTasks]);
      const index = state.tasks.findIndex(({ id }) => id === taskId);
      state.tasks[index].done = !state.tasks[index].done;
      state.tasks[index].doneDate = state.tasks[index].done ? doneDate : null;
      state.redoStack = [];
    },
    removeTasks: (state, { payload: { taskId, lastTasks } }) => {
      const index = state.tasks.findIndex(({ id }) => id === taskId);
      if (index !== -1) {
        state.undoStack.push([...lastTasks]);
        state.tasks.splice(index, 1);
        state.redoStack = [];
      }
    },
    setAllDone: (state, { payload: { lastTasks } }) => {
      state.undoStack.push([...lastTasks]);
      for (const task of state.tasks) {
        task.done = true;
      };
      state.redoStack = [];
    },
    setAllUndone: (state, { payload: { lastTasks } }) => {
      state.undoStack.push([...lastTasks]);
      for (const task of state.tasks) {
        task.done = false;
      };
      state.redoStack = [];
    },
    setTasks: (state, { payload: { tasks, lastTasks } }) => {
      state.undoStack.push([...lastTasks]);
      state.tasks = tasks;
      state.redoStack = [];
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
    toggleShowSearch: state => {
      state.showSearch = !state.showSearch;
    },
    undo: (state) => {
      state.redoStack.push([...state.tasks]);
      state.tasks = state.undoStack.pop();
    },
    redo: (state) => {
      state.undoStack.push([...state.tasks]);
      state.tasks = state.redoStack.pop();
    },
    setEditListName: (state) => {
      state.editListName = !state.editListName;
    },
    setListName: (state, { payload: listName }) => {
      state.listName = listName;
    },
  },
});

export const {
  addTask,
  editTask,
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
  undo,
  redo,
  setEditListName,
  setListName,
} = tasksSlice.actions;

const selectTasksState = state => state.tasks;

export const selectTasks = state => selectTasksState(state).tasks;
export const selectEditedTask = state => selectTasksState(state).editedTask;
export const selectHideDone = state => selectTasksState(state).hideDone;
export const selectFetchStatus = state => selectTasksState(state).fetchStatus;
export const selectShowSearch = state => selectTasksState(state).showSearch;
export const selectUndoStack = state => selectTasksState(state).undoStack;
export const selectRedoStack = state => selectTasksState(state).redoStack;
export const selectListName = state => selectTasksState(state).listName;
export const selectEditListName = state => selectTasksState(state).editListName;

export const selectAreTasksEmpty = state => selectTasks(state).length === 0;
export const selectIsEveryTaskDone = state => selectTasks(state).every(({ done }) => done);
export const selectIsEveryTaskUndone = state => selectTasks(state).every(({ done }) => !done);
export const selectTaskById = (state, taskId) => selectTasks(state).find(({ id }) => id === taskId);

export const selectTasksByQuery = (state, query) => {
  const tasks = selectTasks(state);

  if (!query || query === "") return tasks;

  return tasks.filter(({ content }) => content.toUpperCase().includes(query.toUpperCase().trim()))
};

export default tasksSlice.reducer;