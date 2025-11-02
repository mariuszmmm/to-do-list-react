import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  getSettingsFromLocalStorage,
  getTasksFromLocalStorage,
  getListMetadataFromLocalStorage,
  clearLocalStorage,
} from "../../utils/localStorage";
import { ListMetadata, Task } from "../../types";
import { RootState } from "../../store";
import { t } from "i18next";

interface TaskState {
  tasks: Task[];
  editedTask: Task | null;
  hideDone: boolean;
  showSearch: boolean;
  undoTasksStack: { tasks: Task[]; listMetadata: ListMetadata }[];
  redoTasksStack: { tasks: Task[]; listMetadata: ListMetadata }[];
  listMetadata: ListMetadata;
  listNameToEdit: string | null;
  isTasksSorting: boolean;
  tasksToArchive: Task[];
}

const getInitialState = (): TaskState => ({
  tasks: getTasksFromLocalStorage() || [],
  editedTask: null,
  hideDone: getSettingsFromLocalStorage()?.hideDone || false,
  showSearch: getSettingsFromLocalStorage()?.showSearch || false,
  undoTasksStack: [],
  redoTasksStack: [],
  listMetadata: getListMetadataFromLocalStorage() || {
    id: "",
    date: "",
    name: "",
  },

  // name: getListNameFromLocalStorage() || "",
  listNameToEdit: null,
  isTasksSorting: false,
  tasksToArchive: [],
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
        stateForUndo: { tasks: Task[]; listMetadata: ListMetadata };
      }>
    ) => {
      state.undoTasksStack.push(stateForUndo);
      state.tasks.push(task);
      state.redoTasksStack = [];
      if (!state.listMetadata.name) {
        state.listMetadata.name = t("tasksPage.tasks.defaultListName");
      }
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
        stateForUndo: { tasks: Task[]; listMetadata: ListMetadata };
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
        doneDate: string | null;
        stateForUndo: { tasks: Task[]; listMetadata: ListMetadata };
      }>
    ) => {
      state.undoTasksStack.push(stateForUndo);
      const index = state.tasks.findIndex(({ id }) => id === taskId);
      if (index !== -1) {
        state.tasks[index].done = !state.tasks[index].done;
        state.tasks[index].doneDate = state.tasks[index].done ? doneDate : null;
      }
      state.redoTasksStack = [];
    },
    removeTask: (
      state,
      {
        payload: { taskId, stateForUndo },
      }: PayloadAction<{
        taskId: string;
        stateForUndo: { tasks: Task[]; listMetadata: ListMetadata };
      }>
    ) => {
      const index = state.tasks.findIndex(({ id }) => id === taskId);
      if (index !== -1) {
        state.undoTasksStack.push(stateForUndo);
        state.tasks.splice(index, 1);
        state.redoTasksStack = [];
      }
    },
    removeTasks: (state) => {
      state.undoTasksStack.push({
        tasks: state.tasks,
        listMetadata: state.listMetadata,
      });
      state.listMetadata = {
        id: "",
        date: "",
        name: "",
      };
      state.tasks = [];
      state.redoTasksStack = [];
      state.editedTask = null;
    },
    setTaskListToArchive: (
      state,
      { payload: tasksToArchive }: PayloadAction<Task[]>
    ) => {
      state.tasksToArchive = tasksToArchive;
    },
    setAllDone: (
      state,
      {
        payload: stateForUndo,
      }: PayloadAction<{ tasks: Task[]; listMetadata: ListMetadata }>
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
      }: PayloadAction<{ tasks: Task[]; listMetadata: ListMetadata }>
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
        payload: { listMetadata, tasks, stateForUndo },
      }: PayloadAction<{
        listMetadata: ListMetadata;
        tasks: Task[];
        stateForUndo: { tasks: Task[]; listMetadata: ListMetadata };
      }>
    ) => {
      state.undoTasksStack.push(stateForUndo);
      state.listMetadata = listMetadata;
      state.tasks = tasks;
      state.redoTasksStack = [];
    },
    toggleShowSearch: (state) => {
      state.showSearch = !state.showSearch;
    },
    undoTasks: (state) => {
      state.redoTasksStack.push({
        tasks: state.tasks,
        listMetadata: state.listMetadata,
      });
      const undoTasksStack = state.undoTasksStack.pop();
      if (undoTasksStack === undefined) return;
      state.tasks = undoTasksStack.tasks;
      state.listMetadata = undoTasksStack.listMetadata;
    },
    redoTasks: (state) => {
      state.undoTasksStack.push({
        tasks: state.tasks,
        listMetadata: state.listMetadata,
      });
      const redoTasksStack = state.redoTasksStack.pop();
      if (redoTasksStack === undefined) return;
      state.tasks = redoTasksStack.tasks;
      state.listMetadata = redoTasksStack.listMetadata;
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
        payload: { listMetadata, stateForUndo },
      }: PayloadAction<{
        listMetadata: ListMetadata;
        stateForUndo: { tasks: Task[]; listMetadata: ListMetadata };
      }>
    ) => {
      state.undoTasksStack.push(stateForUndo);
      state.listMetadata = listMetadata;
      state.redoTasksStack = [];
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
    },
    switchTaskSort: (state) => {
      if (!state.isTasksSorting) {
        state.undoTasksStack.push({
          tasks: state.tasks,
          listMetadata: state.listMetadata,
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
  },
});

export const {
  addTask,
  setTaskToEdit,
  saveEditedTask,
  toggleHideDone,
  toggleTaskDone,
  removeTask,
  removeTasks,
  setTaskListToArchive,
  setAllDone,
  setAllUndone,
  setTasks,
  toggleShowSearch,
  undoTasks,
  redoTasks,
  setListNameToEdit,
  setListMetadata,
  taskMoveUp,
  taskMoveDown,
  switchTaskSort,
  clearStorage,
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
export const selectListMetadata = (state: RootState) =>
  selectTasksState(state).listMetadata;
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
export const selectIsTasksSorting = (state: RootState) =>
  selectTasksState(state).isTasksSorting;
export const selectTasksByQuery = (state: RootState, query: string | null) => {
  const tasks = selectTasks(state);

  if (!query || query === "") return tasks;

  return tasks.filter(({ content }) =>
    content.toUpperCase().includes(query.toUpperCase().trim())
  );
};
export const selectTasksToArchive = (state: RootState) =>
  selectTasksState(state).tasksToArchive;

export default tasksSlice.reducer;
