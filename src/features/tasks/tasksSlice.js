import { createSlice } from "@reduxjs/toolkit";

const items = localStorage.getItem("tasks") ? JSON.parse(localStorage.getItem("tasks")) : [];

const setItems = (tasks) => localStorage.setItem("tasks", JSON.stringify(tasks));

const tasksSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: items,
    hideDone: false,
  },
  reducers: {
    addTask: ({ tasks }, { payload: task }) => {
      tasks.push(task);

      setItems(tasks);
    },
    toggleHideDone: state => {
      state.hideDone = !state.hideDone;
    },
    toggleTaskDone: ({ tasks }, { payload: taskId }) => {
      const index = tasks.findIndex(({ id }) => id === taskId);
      tasks[index].done = !tasks[index].done;

      setItems(tasks);
    },
    removeTasks: ({ tasks }, { payload: taskId }) => {
      const index = tasks.findIndex(({ id }) => id === taskId);
      tasks.splice(index, 1);

      setItems(tasks);
    },
    setAllDone: ({ tasks }) => {
      for (const task of tasks) {
        task.done = true;

        setItems(tasks);
      };
    },
  },
});

export const {
  addTask,
  toggleHideDone,
  toggleTaskDone,
  removeTasks,
  setAllDone
} = tasksSlice.actions;

const selectTasksState = state => state.tasks;

export const selectTasks = state => selectTasksState(state).tasks;
export const selectHideDone = state => selectTasksState(state).hideDone;
export const selectAreTasksEmpty = state => selectTasks(state).length === 0;
export const selectIsEveryTaskDone = state => selectTasks(state).every(({ done }) => done);

export default tasksSlice.reducer;