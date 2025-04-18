import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { List } from "../../types";
import { RootState } from "../../store";

interface ListsState {
  lists: List[] | null;
  selectedListId: string | null;
  listToLoad: List | null;
  isListsSorting: boolean;
}

const initialState: ListsState = {
  lists: null,
  selectedListId: null,
  listToLoad: null,
  isListsSorting: false,
};

const listsSlice = createSlice({
  name: "lists",
  initialState,
  reducers: {
    setLists: (state, { payload: lists }: PayloadAction<List[] | null>) => {
      state.lists = lists;
      if (lists === null) state.selectedListId = null;
    },
    selectList: (state, { payload: listId }: PayloadAction<string | null>) => {
      if (state.selectedListId === listId || listId === null) {
        state.selectedListId = null;
      } else {
        state.selectedListId = listId;
      }
    },
    setListToLoad: (
      state,
      { payload: taskList }: PayloadAction<List | null>
    ) => {
      state.listToLoad = taskList;
      if (taskList === null) state.selectedListId = null;
    },
    addListRequest: (state, action: PayloadAction<List>) => {},
    removeListRequest: (
      state,
      {
        payload: { listId, listName },
      }: PayloadAction<{ listId: string; listName: string }>
    ) => {},
    listMoveUp: (state, { payload: index }) => {
      if (state.lists === null) return;

      let lists = [...state.lists];
      const selectedList = lists[index];
      const prevList = lists[index - 1];

      if (!selectedList || !prevList) return;

      state.lists = lists.map((list, i) => {
        if (i === index - 1) {
          return selectedList;
        }
        if (i === index) {
          return prevList;
        }
        return list;
      });
    },
    listMoveDown: (state, { payload: index }) => {
      if (state.lists === null) return;

      let lists = [...state.lists];
      const selectedList = lists[index];
      const nextList = lists[index + 1];

      if (!selectedList || !nextList) return;

      state.lists = lists.map((list, i) => {
        if (i === index) {
          return nextList;
        }
        if (i === index + 1) {
          return selectedList;
        }
        return list;
      });
    },
    switchListSort: (state) => {
      state.isListsSorting = !state.isListsSorting;
    },
  },
});

export const {
  setLists,
  selectList,
  setListToLoad,
  addListRequest,
  removeListRequest,
  listMoveUp,
  listMoveDown,
  switchListSort,
} = listsSlice.actions;

const selectListsState = (state: RootState) => state.lists;

export const selectLists = (state: RootState) => selectListsState(state).lists;
export const selectSelectedListId = (state: RootState) =>
  selectListsState(state).selectedListId;
export const selectListToLoad = (state: RootState) =>
  selectListsState(state).listToLoad;
export const selectAreListsEmpty = (state: RootState) =>
  selectLists(state)?.length === 0;
export const selectIsListsSorting = (state: RootState) =>
  selectListsState(state).isListsSorting;
export const selectListAlreadyExists = (state: RootState, listName: string) =>
  selectLists(state)?.some(({ name }) => name === listName) || false;
export const selectSelectedListById = (state: RootState, listId: string) => {
  const list = selectLists(state)?.find(({ id }) => id === listId) || null;
  return list;
};

export default listsSlice.reducer;
