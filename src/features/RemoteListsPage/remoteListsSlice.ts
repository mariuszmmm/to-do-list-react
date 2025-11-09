import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { List } from "../../types/list";
import { Version } from "../../types";

interface ListsState {
  version: Version | null;
  selectedListId: string | null;
  listToLoad: List | null;
  isListsSorting: boolean;
  listsToSort: { lists: List[]; version: Version } | null;
  listToRemove: List | null;
  listToAdd: List | null;
}

const getInitialState = (): ListsState => ({
  version: null,
  selectedListId: null,
  listToLoad: null,
  isListsSorting: false,
  listsToSort: null,
  listToRemove: null,
  listToAdd: null,
});

const remoteListsSlice = createSlice({
  name: "remoteLists",
  initialState: getInitialState(),
  reducers: {
    setVersion: (
      state,
      { payload: version }: PayloadAction<Version | null>
    ) => {
      state.version = version;
    },
    selectList: (state, { payload: listId }: PayloadAction<string | null>) => {
      if (state.selectedListId === listId || listId === null) {
        state.selectedListId = null;
      } else {
        state.selectedListId = listId;
      }
      state.listToLoad = null;
    },
    setListToAdd: (
      state,
      { payload: listToAdd }: PayloadAction<List | null>
    ) => {
      state.listToAdd = listToAdd;
    },
    setListToLoad: (
      state,
      { payload: taskList }: PayloadAction<List | null>
    ) => {
      state.listToLoad = taskList;
      if (taskList === null) state.selectedListId = null;
    },
    setListToRemove: (
      state,
      { payload: listToRemove }: PayloadAction<List | null>
    ) => {
      state.listToRemove = listToRemove;
    },
    setListToSort: (
      state,
      {
        payload: sortedList,
      }: PayloadAction<{ lists: List[]; version: Version } | null>
    ) => {
      state.listsToSort = sortedList;
    },
    switchListSort: (state) => {
      state.isListsSorting = !state.isListsSorting;
    },
  },
});

export const {
  setVersion,
  selectList,
  setListToAdd,
  setListToLoad,
  setListToRemove,
  setListToSort,
  switchListSort,
} = remoteListsSlice.actions;

const selectRemoteListsState = (state: RootState) => state.remoteLists;

export const selectVersion = (state: RootState) =>
  selectRemoteListsState(state).version;
export const selectSelectedListId = (state: RootState) =>
  selectRemoteListsState(state).selectedListId;
export const selectIsListsSorting = (state: RootState) =>
  selectRemoteListsState(state).isListsSorting;
export const selectListToAdd = (state: RootState) =>
  selectRemoteListsState(state).listToAdd;
export const selectListToLoad = (state: RootState) =>
  selectRemoteListsState(state).listToLoad;
export const selectListToRemove = (state: RootState) =>
  selectRemoteListsState(state).listToRemove;
export const selectListToSort = (state: RootState) =>
  selectRemoteListsState(state).listsToSort;

export default remoteListsSlice.reducer;
