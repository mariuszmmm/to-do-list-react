import {
  call,
  put,
  race,
  select,
  take,
  TakeEffect,
  takeEvery,
} from "redux-saga/effects";
import { addDataApi, getDataApi, removeDataApi } from "../../api/fetchDataApi";
import { Data, Version } from "../../types";
import {
  addListRequest,
  addListSuccess,
  removeListRequest,
  removeListSuccess,
  selectLists,
  selectListToLoad,
  setLists,
} from "./listsSlice";
import {
  selectLoggedUserEmail,
  selectVersion,
  setLoggedUserEmail,
  setVersion,
} from "../AccountPage/accountSlice";
import { cancel, closeModal, confirm, openModal } from "../../Modal/modalSlice";
import { getUserToken } from "../../utils/getUserToken";
import { clearUserFromLocalStorage } from "../../utils/localStorage";

function* setLoggedUserEmailHandler(): Generator {
  const loggedUserEmail = (yield select(selectLoggedUserEmail)) as ReturnType<
    typeof selectLoggedUserEmail
  >;
  const lists = (yield select(selectLists)) as ReturnType<typeof selectLists>;

  if (!loggedUserEmail) {
    if (lists) yield put(setLists(null));
    return;
  }

  const listToLoad = (yield select(selectListToLoad)) as ReturnType<
    typeof selectListToLoad
  >;
  if (listToLoad && lists) yield put(setLists(null));

  try {
    yield put(
      openModal({
        title: "Pobieranie list",
        message: "Trwa pobieranie list...",
        type: "loading",
      })
    );

    const token = (yield call(getUserToken)) as string | null;

    if (!token) {
      yield put(setLoggedUserEmail(null));
      throw new Error("No token found");
    }

    const data = (yield call(getDataApi, token)) as Data | null;
    if (!data || !data.lists || !data.version) throw new Error("No data");
    yield put(setLists(data.lists));
    yield put(setVersion(data.version));
    yield put(
      openModal({
        message: "Listy zostały pobrane.",
        type: "success",
      })
    );
  } catch (error) {
    yield put(
      openModal({
        message: "Wystąpił błąd podczas pobierania list.",
        type: "error",
      })
    );
    if (lists) yield put(setLists(null));
    yield put(setLoggedUserEmail(null));
    yield call(clearUserFromLocalStorage);
  }
}

function* refreshListsHandler(): Generator {
  yield put(
    openModal({
      message:
        "Operacja nie mogła być wykonana poprawnie, ponieważ pobrane listy są nieaktualne. Odśwież i sprobuj ponownie.",
      type: "confirm",
      confirmButtonText: "Odśwież",
    })
  );

  const { confirmed, canceled } = (yield race({
    confirmed: take(confirm.type),
    canceled: take(cancel.type),
  })) as { confirmed: TakeEffect; canceled: TakeEffect };

  if (confirmed) {
    yield setLoggedUserEmailHandler();
  } else if (canceled) {
    yield put(closeModal());
  }
}

function* addListRequestHandler({
  payload: list,
}: ReturnType<typeof addListRequest>): Generator {
  try {
    yield put(
      openModal({
        title: "Zapisywanie listy",
        message: `Zapisywanie listy ${list.name} w bazie danych...`,
        type: "loading",
      })
    );

    const version = (yield select(selectVersion)) as Version;
    const token = (yield call(getUserToken)) as string | null;

    if (!token) {
      yield put(setLists(null));
      yield put(setVersion(null));
      yield put(setLoggedUserEmail(null));
      throw new Error("No token found");
    }

    const data = (yield call(addDataApi, token, version, list)) as Data | null;
    if (!data) throw new Error("No data");

    if (!data.version) {
      yield refreshListsHandler();
      return;
    }

    if (!data.lists) throw new Error("No lists");

    yield put(addListSuccess(list));
    yield put(setLists(data.lists));
    yield put(setVersion(data.version));
    yield put(
      openModal({
        message: `Lista ${list.name} została zapisana w bazie danych.`,
        type: "success",
      })
    );
  } catch (error: any) {
    yield put(
      openModal({
        message: "Wystąpił błąd podczas dodawania listy do bazy danych.",
        type: "error",
      })
    );
    yield call(clearUserFromLocalStorage);
  }
}

function* removeListRequestHandler({
  payload: { listId, listName },
}: ReturnType<typeof removeListRequest>): Generator {
  yield put(
    openModal({
      title: "Usuwanie listy",
      message: `Czy na pewno chcesz usunąć listę: ${listName} ?`,
      type: "confirm",
      confirmButtonText: "Usuń",
    })
  );

  const { confirmed, canceled } = (yield race({
    confirmed: take(confirm.type),
    canceled: take(cancel.type),
  })) as { confirmed: TakeEffect; canceled: TakeEffect };

  if (confirmed) {
    try {
      yield put(
        openModal({
          message: "Trwa usuwanie listy...",
          type: "loading",
        })
      );

      const version = (yield select(selectVersion)) as Version;
      const token = (yield call(getUserToken)) as string | null;

      if (!token) {
        yield put(setLists(null));
        yield put(setVersion(null));
        yield put(setLoggedUserEmail(null));
        throw new Error("No token found");
      }

      const data = (yield call(
        removeDataApi,
        token,
        version,
        listId
      )) as Data | null;
      if (!data) throw new Error("No data");

      if (!data.version) {
        yield refreshListsHandler();
        return;
      }

      if (!data.lists) throw new Error("No lists");

      yield put(removeListSuccess(listId));
      yield put(setLists(data.lists));
      yield put(setVersion(data.version));
      yield put(
        openModal({
          message: "Lista została usunięta z bazy danych.",
          type: "success",
        })
      );
    } catch (error) {
      yield put(
        openModal({
          message: "Wystąpił błąd podczas usuwania listy.",
          type: "error",
        })
      );
      yield call(clearUserFromLocalStorage);
    }
  } else if (canceled) {
    yield put(closeModal());
  }
}

export function* listsSaga() {
  yield takeEvery(setLoggedUserEmail.type, setLoggedUserEmailHandler);
  yield takeEvery(addListRequest.type, addListRequestHandler);
  yield takeEvery(removeListRequest.type, removeListRequestHandler);
}
