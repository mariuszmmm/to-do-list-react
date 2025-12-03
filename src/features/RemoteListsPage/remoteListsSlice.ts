import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { List } from "../../types/list";

interface ListsState {
  selectedListId: string | null;
  listToLoad: List | null;
  isListsSorting: boolean;
  listsToSort: List[] | null;
  listToRemove: List | null;
  listToAdd: List | null;
}

const getInitialState = (): ListsState => ({
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
    selectList: (state, { payload: listId }: PayloadAction<string | null>) => {
      state.selectedListId = listId;
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
      { payload: sortedList }: PayloadAction<List[] | null>
    ) => {
      state.listsToSort = sortedList;
    },
    switchListSort: (state) => {
      state.isListsSorting = !state.isListsSorting;
    },
  },
});

export const {
  selectList,
  setListToAdd,
  setListToLoad,
  setListToRemove,
  setListToSort,
  switchListSort,
} = remoteListsSlice.actions;

const selectRemoteListsState = (state: RootState) => state.remoteLists;

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
