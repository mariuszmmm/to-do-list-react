import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getListsFromLocalStorage } from "../../utils/localStorage";
import { List, Task } from "../../types";
import { RootState } from "../../store";

interface ListsState {
  lists: List[];
  selectedListId: string | null;
  listToLoad: List | null;
  undoListsStack: List[][];
  redoListsStack: List[][];
}

const initialState: ListsState = {
  lists: getListsFromLocalStorage() || [],
  selectedListId: null,
  listToLoad: null,
  undoListsStack: [],
  redoListsStack: [],
};

const listsSlice = createSlice({
  name: "lists",
  initialState,
  reducers: {
    addList: (
      state,
      {
        payload: { name, taskList, id, lastLists },
      }: PayloadAction<{
        name: string;
        taskList: Task[];
        id: string;
        lastLists: List[];
      }>
    ) => {
      state.undoListsStack.push(lastLists);
      state.lists.push({ name, taskList, id });
      state.redoListsStack = [];
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
    removeList: (
      state,
      {
        payload: { listId, lastLists },
      }: PayloadAction<{ listId: string; lastLists: List[] }>
    ) => {
      state.undoListsStack.push(lastLists);
      const index = state.lists.findIndex(({ id }) => id === listId);
      if (index !== -1) {
        state.lists.splice(index, 1);
        if (state.selectedListId === listId) {
          state.selectedListId = null;
        }
      }
      state.redoListsStack = [];
    },
    undoLists: (state) => {
      state.redoListsStack.push(state.lists);
      const undoListsStack = state.undoListsStack.pop();
      if (undoListsStack === undefined) return;
      state.lists = undoListsStack;
    },
    redoLists: (state) => {
      state.undoListsStack.push(state.lists);
      const redoListsStack = state.redoListsStack.pop();
      if (redoListsStack === undefined) return;
      state.lists = redoListsStack;
    },
  },
});

export const {
  addList,
  selectList,
  setListToLoad,
  removeList,
  undoLists,
  redoLists,
} = listsSlice.actions;

const selectListsState = (state: RootState) => state.lists;

export const selectLists = (state: RootState) => selectListsState(state).lists;
export const selectSelectedListId = (state: RootState) =>
  selectListsState(state).selectedListId;
export const selectListToLoad = (state: RootState) =>
  selectListsState(state).listToLoad;
export const selectUndoListsStack = (state: RootState) =>
  selectListsState(state).undoListsStack;
export const selectRedoListsStack = (state: RootState) =>
  selectListsState(state).redoListsStack;
export const selectAreListsEmpty = (state: RootState) =>
  selectLists(state).length === 0;
export const selectIsListWithName = (state: RootState, listName: string) =>
  selectLists(state).some(({ name }) => name === listName);
export const selectSelectedListById = (state: RootState, listId: string) => {
  const list = selectLists(state).find(({ id }) => id === listId) || null;
  return list;
};

export default listsSlice.reducer;
