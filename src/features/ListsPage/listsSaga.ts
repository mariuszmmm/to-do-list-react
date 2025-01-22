import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import { addDataApi, getDataApi, removeDataApi } from "../../utils/fetchApi";
import { getUserTokenFromLocalStorage } from "../../utils/localStorage";
import { Data } from "../../types";
import { addList, removeList, setLists } from "./listsSlice";
import { setLoggedUser } from "../AccountPage/accountSlice";

function* addListHandler({
  payload: data,
}: ReturnType<typeof addList>): Generator {
  const token = getUserTokenFromLocalStorage();
  if (token) yield call(addDataApi, token, data);
}

function* removeListHandler({
  payload: id,
}: ReturnType<typeof removeList>): Generator {
  const token = getUserTokenFromLocalStorage();
  if (token) yield call(removeDataApi, token, id);
}

function* setLoggedUserHandler(): Generator {
  const token = getUserTokenFromLocalStorage();
  if (token) {
    const data = (yield call(getDataApi, token)) as Data | null;
    yield put(setLists(data ? data.lists : null));
  } else {
    yield put(setLists(null));
  }
}

export function* listsSaga() {
  yield takeEvery(addList.type, addListHandler);
  yield takeEvery(removeList.type, removeListHandler);
  yield takeLatest(setLoggedUser.type, setLoggedUserHandler);
}
