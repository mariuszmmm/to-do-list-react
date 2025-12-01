import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { List, Task } from "../../types";
import { RootState } from "../../store";
import { getArchivedListFromLocalStorage } from "../../utils/localStorage";
import { nanoid } from "nanoid";

interface ArchivedListsState {
  archivedLists: List[];
  selectedArchivedListId: string | null;
  archivedListToLoad: List | null;
  isArchivedListsSorting: boolean;
  archivedListToRemove: List | null;
  archivedListToAdd: List | null;
}

const getInitialState = (): ArchivedListsState => ({
  archivedLists: getArchivedListFromLocalStorage() || [],
  selectedArchivedListId: null,
  archivedListToLoad: null,
  isArchivedListsSorting: false,
  archivedListToRemove: null,
  archivedListToAdd: null,
});

const archivedListsSlice = createSlice({
  name: "archivedLists",
  initialState: getInitialState(),
  reducers: {
    selectArchivedList: (
      state,
      { payload: listId }: PayloadAction<string | null>
    ) => {
      if (state.selectedArchivedListId === listId || listId === null) {
        state.selectedArchivedListId = null;
      } else {
        state.selectedArchivedListId = listId;
      }
      state.archivedListToLoad = null;
    },
    setArchivedListToLoad: (
      state,
      { payload: archivedTaskList }: PayloadAction<List | null>
    ) => {
      state.archivedListToLoad = archivedTaskList;
      if (archivedTaskList === null) state.selectedArchivedListId = null;
    },
    setArchivedListToRemove: (
      state,
      { payload: listToRemove }: PayloadAction<List | null>
    ) => {
      state.archivedListToRemove = listToRemove;
    },
    removeArchivedList: (state, { payload: listId }: PayloadAction<string>) => {
      state.archivedLists = state.archivedLists.filter(
        (list) => list.id !== listId
      );
      if (state.selectedArchivedListId === listId)
        state.selectedArchivedListId = null;
    },
    addArchivedList: (
      state,
      {
        payload: { name, tasks },
      }: PayloadAction<{ name: string; tasks: Task[] }>
    ) => {
      const time = new Date().toISOString();
      const list = {
        id: nanoid(8),
        name,
        date: time,
        updatedAt: time,
        version: 0,
        taskList: tasks.map((task) => ({
          ...task,
          id: nanoid(8),
        })),
      };
      state.archivedLists.push(list);
    },
  },
});

export const {
  selectArchivedList,
  setArchivedListToLoad,
  setArchivedListToRemove,
  removeArchivedList,
  addArchivedList,
} = archivedListsSlice.actions;

const selectArchivedListsState = (state: RootState) => state.archivedLists;

export const selectSelectedArchivedListId = (state: RootState) =>
  selectArchivedListsState(state).selectedArchivedListId;
export const selectArchivedListToLoad = (state: RootState) =>
  selectArchivedListsState(state).archivedListToLoad;
export const selectIsArchivedListsSorting = (state: RootState) =>
  selectArchivedListsState(state).isArchivedListsSorting;
export const selectArchivedListToRemove = (state: RootState) =>
  selectArchivedListsState(state).archivedListToRemove;
export const selectArchivedListToAdd = (state: RootState) =>
  selectArchivedListsState(state).archivedListToAdd;
export const selectArchivedLists = (state: RootState) =>
  selectArchivedListsState(state).archivedLists;
export const selectIsArchivedTaskListEmpty = (state: RootState) =>
  selectArchivedLists(state).length === 0;

export default archivedListsSlice.reducer;
