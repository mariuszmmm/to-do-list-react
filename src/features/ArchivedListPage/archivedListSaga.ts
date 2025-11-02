import { call, put, race, select, take, takeEvery } from "redux-saga/effects";
import { closeModal, confirm, openModal, cancel } from "../../Modal/modalSlice";
import {
  addArchivedList,
  removeArchivedList,
  selectArchivedListToRemove,
  selectArchivedLists,
  setArchivedListToRemove,
} from "./archivedListsSlice";
import { List } from "../../types";
import { saveArchivedListsInStorage } from "../../utils/localStorage";

function* saveListInArchivedStorageHandler() {
  const lists: ReturnType<typeof selectArchivedLists> = yield select(
    selectArchivedLists
  );

  yield call(saveArchivedListsInStorage, lists);
}

function* handleArchivedListRemove() {
  const listToRemove: List | null = yield select(selectArchivedListToRemove);
  if (!listToRemove) return;

  yield put(
    openModal({
      title: { key: "modal.listRemove.title" },
      message: {
        key: "modal.listRemove.message.confirm",
        values: { name: listToRemove.name },
      },
      type: "confirm",
      confirmButton: { key: "modal.buttons.deleteButton" },
    })
  );

  const { cancelled } = yield race({
    confirmed: take(confirm),
    cancelled: take(cancel),
  });

  if (cancelled) {
    yield put(setArchivedListToRemove(null));
    yield put(closeModal());
    return;
  }

  yield put(removeArchivedList(listToRemove.id));
  yield put(setArchivedListToRemove(null));
  yield put(closeModal());
}

export function* archivedListSaga() {
  yield takeEvery(
    [removeArchivedList.type, addArchivedList.type],
    saveListInArchivedStorageHandler
  );
  yield takeEvery(setArchivedListToRemove.type, handleArchivedListRemove);
}
