import { createSlice } from "@reduxjs/toolkit";
import { getListsFromLocalStorage } from "../../utils/localStorage";

const listsSlice = createSlice({
  name: "lists",
  initialState: {
    lists: getListsFromLocalStorage(),
    selectedListId: null,
    listToDownload: null,
    fetchStatus: "ready",
    undoStack: [],
    redoStack: [],
  },
  reducers: {
    addList: (state, { payload: { name, list, id } }) => {
      state.lists.push({ name, list, id });
    },
    selectList: (state, { payload: listId }) => {
      if (state.selectedListId === listId) {
        state.selectedListId = null;
      } else {
        state.selectedListId = listId;
      }
    },
    setListToDownload: (state, { payload: list }) => {
      state.listToDownload = list;
      state.selectedListId = null;
    },
    removeList: (state, { payload: { listId, lastLists } }) => {
      state.undoStack.push([...lastLists]);
      const index = state.lists.findIndex(({ id }) => id === listId);
      if (index !== -1) {
        state.lists.splice(index, 1);
        if (state.selectedListId === listId) {
          state.selectedListId = null;
        };
      };
      state.redoStack = [];
    },
    undo: (state) => {
      state.redoStack.push([...state.lists]);
      state.lists = state.undoStack.pop();
    },
    redo: (state) => {
      state.undoStack.push([...state.lists]);
      state.lists = state.redoStack.pop();
    },
  },
});

export const {
  addList,
  selectList,
  setListToDownload,
  removeList,
  undo,
  redo,
} = listsSlice.actions;

const selectListsState = state => state.lists;

export const selectLists = state => selectListsState(state).lists;
export const selectSelectedListId = state => selectListsState(state).selectedListId;
export const selectListToDownload = state => selectListsState(state).listToDownload;
export const selectUndoStack = state => selectListsState(state).undoStack;
export const selectRedoStack = state => selectListsState(state).redoStack;
export const selectAreListsEmpty = state => selectLists(state).length === 0;
export const selectIsListWithName = (state, listName) => selectLists(state).some(({ name }) => name === listName);
export const selectSelectedListById = (state, listId) => selectLists(state).find(({ id }) => id === listId);

export default listsSlice.reducer;