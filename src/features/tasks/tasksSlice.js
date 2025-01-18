import { createSlice } from "@reduxjs/toolkit";
import { getSettingsFromLocalStorage, getTasksFromLocalStorage, getListNameFromLocalStorage } from "../../utils/localStorage";

const InitialListName = getTasksFromLocalStorage().length > 0 ? getListNameFromLocalStorage() : "Nowa lista";

const tasksSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: getTasksFromLocalStorage(),
    editedTask: null,
    hideDone: getSettingsFromLocalStorage()?.hideDone || false,
    showSearch: getSettingsFromLocalStorage()?.showSearch || false,
    fetchStatus: "ready",
    undoTasksStack: [],
    redoTasksStack: [],
    listName: InitialListName,
    listNameToEdit: null,
  },
  reducers: {
    addTask: (state, { payload: { task, stateForUndo } }) => {
      state.undoTasksStack.push(stateForUndo);
      state.tasks.push(task);
      state.redoTasksStack = [];
    },
    setTaskToEdit: (state, { payload: taskId }) => {
      const index = state.tasks.findIndex(task => task.id === taskId);
      state.editedTask = taskId ? state.tasks[index] : null;
    },
    saveEditedTask: (state, { payload: { task: { id, content, editedDate }, stateForUndo } }) => {
      state.undoTasksStack.push(stateForUndo);
      const index = state.tasks.findIndex(task => task.id === id);
      state.tasks[index].content = content;
      state.tasks[index].editedDate = editedDate;
      state.editedTask = null;
      state.redoTasksStack = [];
    },
    toggleHideDone: state => {
      state.hideDone = !state.hideDone;
    },
    toggleTaskDone: (state, { payload: { taskId, doneDate, stateForUndo } }) => {
      state.undoTasksStack.push(stateForUndo);
      const index = state.tasks.findIndex(({ id }) => id === taskId);
      state.tasks[index].done = !state.tasks[index].done;
      state.tasks[index].doneDate = state.tasks[index].done ? doneDate : null;
      state.redoTasksStack = [];
    },
    removeTasks: (state, { payload: { taskId, stateForUndo } }) => {
      const index = state.tasks.findIndex(({ id }) => id === taskId);
      if (index !== -1) {
        state.undoTasksStack.push(stateForUndo);
        state.tasks.splice(index, 1);
        state.redoTasksStack = [];
      }
    },
    setAllDone: (state, { payload: stateForUndo }) => {
      state.undoTasksStack.push(stateForUndo);
      for (const task of state.tasks) {
        task.done = true;
      };
      state.redoTasksStack = [];
    },
    setAllUndone: (state, { payload: stateForUndo }) => {
      state.undoTasksStack.push(stateForUndo);
      for (const task of state.tasks) {
        task.done = false;
      };
      state.redoTasksStack = [];
    },
    setTasks: (state, { payload: { tasks, listName, stateForUndo } }) => {
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
      state.fetchStatus = "$error";
    },
    toggleShowSearch: state => {
      state.showSearch = !state.showSearch;
    },
    undoTasks: (state) => {
      state.redoTasksStack.push({ tasks: state.tasks, listName: state.listName });
      const undoTasksState = state.undoTasksStack.pop();
      state.tasks = undoTasksState.tasks;
      state.listName = undoTasksState.listName;
    },
    redoTasks: (state) => {
      state.undoTasksStack.push({ tasks: state.tasks, listName: state.listName });
      const redoTasksState = state.redoTasksStack.pop();
      state.tasks = redoTasksState.tasks;
      state.listName = redoTasksState.listName;
    },
    setListNameToEdit: (state, { payload: listNameToEdit }) => {
      if (listNameToEdit) {
        state.listNameToEdit = listNameToEdit;
      } else {
        state.listNameToEdit = null;
      }
    },
    setListName: (state, { payload: { listName, stateForUndo } }) => {
      state.undoTasksStack.push(stateForUndo);
      state.listName = listName;
      state.redoTasksStack = [];
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
} = tasksSlice.actions;

const selectTasksState = state => state.tasks;

export const selectTasks = state => selectTasksState(state).tasks;
export const selectEditedTask = state => selectTasksState(state).editedTask;
export const selectHideDone = state => selectTasksState(state).hideDone;
export const selectFetchStatus = state => selectTasksState(state).fetchStatus;
export const selectShowSearch = state => selectTasksState(state).showSearch;
export const selectUndoTasksStack = state => selectTasksState(state).undoTasksStack;
export const selectRedoTasksStack = state => selectTasksState(state).redoTasksStack;
export const selectListName = state => selectTasksState(state).listName;
export const selectListNameToEdit = state => selectTasksState(state).listNameToEdit;

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