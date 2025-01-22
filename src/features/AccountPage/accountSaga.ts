import { put, select, takeLatest } from "redux-saga/effects";
import { selectLoggedUser, setMessage } from "./accountSlice";
import { selectLists, setLists } from "../ListsPage/listsSlice";

function* setListsHandler(): Generator {
  const data = (yield select(selectLists)) as ReturnType<typeof selectLists>;
  const loggedUser = (yield select(selectLoggedUser)) as ReturnType<
    typeof selectLoggedUser
  >;

  if (data === null && loggedUser) {
    yield put(
      setMessage({
        text: "Błąd pobierania danych",
        type: "warning",
      })
    );
  }
}

export function* accountSaga() {
  yield takeLatest(setLists.type, setListsHandler);
}
