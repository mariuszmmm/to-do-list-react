import { createSlice } from "@reduxjs/toolkit";
import { getTasksFromLocalStorage } from "./tasksLocalStorage";

const tasksSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: getTasksFromLocalStorage(),
    deletedTasks: [],
    editedTask: null,
    hideDone: false,
    fetchStatus: "ready",
    showSearch: false,
  },
  reducers: {
    addTask: ({ tasks }, { payload: task }) => {
      tasks.push(task);
    },
    editTask: (state, { payload: taskId }) => {
      const index = state.tasks.findIndex(task => task.id === taskId);
      state.editedTask = state.tasks[index];
    },
    saveEditedTask: (state, { payload: { id, content, editedDate } }) => {
      const index = state.tasks.findIndex(task => task.id === id);
      state.tasks[index].content = content;
      state.tasks[index].editedDate = editedDate;
      state.editedTask = null;
    },
    toggleHideDone: state => {
      state.hideDone = !state.hideDone;
    },
    toggleTaskDone: ({ tasks }, { payload: { taskId, doneDate } }) => {
      const index = tasks.findIndex(({ id }) => id === taskId);
      tasks[index].done = !tasks[index].done;
      tasks[index].doneDate = tasks[index].done ? doneDate : null;
    },
    removeTasks: ({ tasks, deletedTasks }, { payload: taskId }) => {
      const index = tasks.findIndex(({ id }) => id === taskId);
      if (index !== -1) {
        deletedTasks.push(tasks[index]);
        tasks.splice(index, 1);
      }
    },
    setAllDone: ({ tasks }) => {
      for (const task of tasks) {
        task.done = true;
      };
    },
    fetchExampleTasks: (state) => {
      state.fetchStatus = "loading";
    },
    setTasks: (state, { payload: tasks }) => {
      state.tasks = tasks;
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
    restoreDeletedTask: ({ tasks, deletedTasks }) => {
      tasks.push(deletedTasks.pop());
    }
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
  fetchExampleTasks,
  resetFetchStatus,
  fetchError,
  setTasks,
  toggleShowSearch,
  restoreDeletedTask,
} = tasksSlice.actions;

const selectTasksState = state => state.tasks;

export const selectTasks = state => selectTasksState(state).tasks;
export const selectEditedTask = state => selectTasksState(state).editedTask;
export const selectAreDeletedTasksEmpty = state => selectTasksState(state).deletedTasks.length === 0;
export const selectHideDone = state => selectTasksState(state).hideDone;
export const selectFetchStatus = state => selectTasksState(state).fetchStatus;
export const selectShowSearch = state => selectTasksState(state).showSearch;
export const selectAreTasksEmpty = state => selectTasks(state).length === 0;
export const selectIsEveryTaskDone = state => selectTasks(state).every(({ done }) => done);
export const selectTaskById = (state, taskId) => selectTasks(state).find(({ id }) => id === taskId);

export const selectTasksByQuery = (state, query) => {
  const tasks = selectTasks(state);

  if (!query || query === "") return tasks;

  return tasks.filter(({ content }) => content.toUpperCase().includes(query.toUpperCase().trim()))
};

export default tasksSlice.reducer;