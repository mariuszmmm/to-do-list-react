import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { List } from "../../types";
import { RootState } from "../../store";

interface ListsState {
  lists: List[] | null;
  selectedListId: string | null;
  listToLoad: List | null;
}

const initialState: ListsState = {
  lists: null,
  selectedListId: null,
  listToLoad: null,
};

const listsSlice = createSlice({
  name: "lists",
  initialState,
  reducers: {
    setLists: (state, { payload: lists }: PayloadAction<List[] | null>) => {
      state.lists = lists;
    },
    addList: (
      state,
      { payload: { id, name, taskList } }: PayloadAction<List>
    ) => {
      if (state.lists === null) return;
      state.lists.push({ id, name, taskList });
    },
    selectList: (state, { payload: listId }: PayloadAction<string>) => {
      if (state.selectedListId === listId) {
        state.selectedListId = null;
      } else {
        state.selectedListId = listId;
      }
    },
    setListToLoad: (state, { payload: taskList }: PayloadAction<List>) => {
      state.listToLoad = taskList;
      state.selectedListId = null;
    },
    removeList: (state, { payload: listId }: PayloadAction<string>) => {
      if (state.lists === null) return;
      const index = state.lists.findIndex(({ id }) => id === listId);
      if (index !== -1) {
        state.lists.splice(index, 1);
        if (state.selectedListId === listId) {
          state.selectedListId = null;
        }
      }
    },
  },
});

export const { setLists, addList, selectList, setListToLoad, removeList } =
  listsSlice.actions;

const selectListsState = (state: RootState) => state.lists;

export const selectLists = (state: RootState) => selectListsState(state).lists;
export const selectSelectedListId = (state: RootState) =>
  selectListsState(state).selectedListId;
export const selectListToLoad = (state: RootState) =>
  selectListsState(state).listToLoad;
export const selectAreListsEmpty = (state: RootState) =>
  selectLists(state)?.length === 0;
export const selectIsListWithName = (state: RootState, listName: string) =>
  selectLists(state)?.some(({ name }) => name === listName);
export const selectSelectedListById = (state: RootState, listId: string) => {
  const list = selectLists(state)?.find(({ id }) => id === listId) || null;
  return list;
};

export default listsSlice.reducer;
