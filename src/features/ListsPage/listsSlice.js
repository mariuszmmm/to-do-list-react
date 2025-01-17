import { createSlice } from "@reduxjs/toolkit";
import { getListsFromLocalStorage } from "../../utils/localStorage";

const listsSlice = createSlice({
  name: "lists",
  initialState: {
    lists: getListsFromLocalStorage(),
    selectedListId: null,
    listToLoad: null,
    undoListsStack: [],
    redoListsStack: [],
  },
  reducers: {
    addList: (state, { payload: { name, list, id, lastLists } }) => {
      state.undoListsStack.push(lastLists);
      state.lists.push({ name, list, id });
      state.redoListsStack = [];
    },
    selectList: (state, { payload: listId }) => {
      if (state.selectedListId === listId) {
        state.selectedListId = null;
      } else {
        state.selectedListId = listId;
      }
    },
    setListToLoad: (state, { payload: list }) => {
      state.listToLoad = list;
      state.selectedListId = null;
    },
    removeList: (state, { payload: { listId, lastLists } }) => {
      state.undoListsStack.push(lastLists);
      const index = state.lists.findIndex(({ id }) => id === listId);
      if (index !== -1) {
        state.lists.splice(index, 1);
        if (state.selectedListId === listId) {
          state.selectedListId = null;
        };
      };
      state.redoListsStack = [];
    },
    undoLists: (state) => {
      state.redoListsStack.push(state.lists);
      state.lists = state.undoListsStack.pop();
    },
    redoLists: (state) => {
      state.undoListsStack.push(state.lists);
      state.lists = state.redoListsStack.pop();
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

const selectListsState = state => state.lists;

export const selectLists = state => selectListsState(state).lists;
export const selectSelectedListId = state => selectListsState(state).selectedListId;
export const selectListToLoad = state => selectListsState(state).listToLoad;
export const selectUndoListsStack = state => selectListsState(state).undoListsStack;
export const selectRedoListsStack = state => selectListsState(state).redoListsStack;
export const selectAreListsEmpty = state => selectLists(state).length === 0;
export const selectIsListWithName = (state, listName) => selectLists(state).some(({ name }) => name === listName);
export const selectSelectedListById = (state, listId) => selectLists(state).find(({ id }) => id === listId);

export default listsSlice.reducer;