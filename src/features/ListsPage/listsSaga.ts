import { call, select, takeEvery } from "redux-saga/effects";
import { saveListsInLocalStorage } from "../../utils/localStorage";
import {
  addList,
  redoLists,
  removeList,
  selectLists,
  undoLists,
} from "./listsSlice";

function* getLocalStorageHandler() {
  const lists: ReturnType<typeof selectLists> = yield select(selectLists);
  const listsWithoutSelect = lists.map(({ selected, ...list }) => list);
  yield call(saveListsInLocalStorage, listsWithoutSelect);
}

export function* listsSaga() {
  yield takeEvery(
    [addList.type, removeList.type, undoLists.type, redoLists.type],
    getLocalStorageHandler
  );
}
