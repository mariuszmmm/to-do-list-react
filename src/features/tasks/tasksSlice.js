import { createSlice } from "@reduxjs/toolkit";

const tasksSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [{ content: "test", id: "sdsd" }],
    hideDone: false,
    aa: "dsds"
  },
  reducers: {
    addTask: ({ tasks }, { payload: task }) => {
      tasks.push(task);
    },
    toggleHideDone: state => {
      state.hideDone = !state.hideDone;
    },
    toggleTaskDone: ({ tasks }, { payload: taskId }) => {
      const index = tasks.findIndex(({ id }) => id === taskId);
      tasks[index].done = !tasks[index].done;
    },
    removeTasks: ({ tasks }, { payload: taskId }) => {
      const index = tasks.findIndex(({ id }) => id === taskId);
      tasks.splice(index, 1);
    },
    setAllDone: ({ tasks }) => {
      for (const task of tasks) {
        task.done = true;
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

export const selectTasksState = state => state.tasks;
export const selectAreTasksEmpty = state => selectTasksState(state).tasks.length === 0;
export const selectIsEveryTaskDone = (state) => selectTasksState(state).tasks.every(({ done }) => done)
export default tasksSlice.reducer;