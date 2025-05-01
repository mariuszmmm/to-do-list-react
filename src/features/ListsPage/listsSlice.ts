import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { List, Version } from "../../types";
import { RootState } from "../../store";

interface ListsState {
  lists: List[] | null;
  selectedListId: string | null;
  listToLoad: List | null;
  isListsSorting: boolean;
  listsToSort: { lists: List[]; version: Version } | null;
  listToRemove: List | null;
  listToAdd: List | null;
}

const getInitialState = (): ListsState => ({
  lists: null,
  selectedListId: null,
  listToLoad: null,
  isListsSorting: false,
  listsToSort: null,
  listToRemove: null,
  listToAdd: null,
});

const listsSlice = createSlice({
  name: "lists",
  initialState: getInitialState(),
  reducers: {
    selectList: (state, { payload: listId }: PayloadAction<string | null>) => {
      if (state.selectedListId === listId || listId === null) {
        state.selectedListId = null;
      } else {
        state.selectedListId = listId;
      }
      state.listToLoad = null;
    },
    setListToLoad: (
      state,
      { payload: taskList }: PayloadAction<List | null>
    ) => {
      state.listToLoad = taskList;
      if (taskList === null) state.selectedListId = null;
    },
    setListToSort: (
      state,
      {
        payload: listsToSort,
      }: PayloadAction<{ lists: List[]; version: Version } | null>
    ) => {
      state.listsToSort = listsToSort;
    },
    setListToRemove: (
      state,
      { payload: listToRemove }: PayloadAction<List | null>
    ) => {
      state.listToRemove = listToRemove;
    },
    setListToAdd: (
      state,
      { payload: listToAdd }: PayloadAction<List | null>
    ) => {
      state.listToAdd = listToAdd;
    },
    switchListSort: (state) => {
      state.isListsSorting = !state.isListsSorting;
    },
  },
});

export const {
  selectList,
  setListToLoad,
  setListToSort,
  setListToRemove,
  setListToAdd,
  switchListSort,
} = listsSlice.actions;

const selectListsState = (state: RootState) => state.lists;

export const selectSelectedListId = (state: RootState) =>
  selectListsState(state).selectedListId;
export const selectListToLoad = (state: RootState) =>
  selectListsState(state).listToLoad;
export const selectIsListsSorting = (state: RootState) =>
  selectListsState(state).isListsSorting;
export const selectListToSort = (state: RootState) =>
  selectListsState(state).listsToSort;
export const selectListToRemove = (state: RootState) =>
  selectListsState(state).listToRemove;
export const selectListToAdd = (state: RootState) =>
  selectListsState(state).listToAdd;

export default listsSlice.reducer;
