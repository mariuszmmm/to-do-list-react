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
  removeListRequest,
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
import { auth } from "../../api/auth";
import i18n from "../../utils/i18n";

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
        title: i18n.t("modal.downloadLists.title"),
        message: { key: "modal.downloadLists.message.loading" },
        type: "loading",
      })
    );

    const token = (yield call(getUserToken)) as string | null;

    if (!token) {
      yield put(setLoggedUserEmail(null));
      throw new Error("No token found");
    }

    const data = (yield call(getDataApi, token)) as Data;

    if (!data || !data.lists || !data.version) throw new Error("No data");

    yield put(setLists(data.lists));
    yield put(setVersion(data.version));
    yield put(
      openModal({
        message: { key: "modal.downloadLists.message.success" },
        type: "success",
      })
    );
  } catch (error) {
    yield put(
      openModal({
        message: { key: "modal.downloadLists.message.error.default" },
        type: "error",
      })
    );

    const user = auth.currentUser();
    if (user) {
      yield user.logout();
      yield put(setLoggedUserEmail(null));
    }
  }
}

function* refreshListsHandler(): Generator {
  yield put(
    openModal({
      message: { key: "modal.refreshLists.message.confirm" },
      confirmButton: i18n.t("modal.buttons.refreshButton"),
      type: "confirm",
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
        title: i18n.t("modal.saveList.title"),
        message: {
          key: "modal.saveList.message.loading",
          values: { listName: list.name },
        },
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

    const response = (yield call(addDataApi, token, version, list)) as {
      data: Data;
    };
    const { data } = response;

    if (!data) {
      yield refreshListsHandler();
      return;
    }

    if (!data.lists || !data.version) throw new Error("No lists or version");

    yield put(setLists(data.lists));
    yield put(setVersion(data.version));
    yield put(
      openModal({
        message: {
          key: "modal.saveList.message.success",
          values: { listName: list.name },
        },
        type: "success",
      })
    );
  } catch (error: any) {
    yield put(
      openModal({
        message: { key: "modal.saveList.message.error.default" },
        type: "error",
      })
    );
  }
}

function* removeListRequestHandler({
  payload: { listId, listName },
}: ReturnType<typeof removeListRequest>): Generator {
  yield put(
    openModal({
      title: i18n.t("modal.removeList.title"),
      message: {
        key: "modal.removeList.message.confirm",
        values: { listName: listName },
      },
      type: "confirm",
      confirmButton: i18n.t("modal.buttons.deleteButton"),
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
          message: { key: "modal.removeList.message.loading" },
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

      const response = (yield call(removeDataApi, token, version, listId)) as {
        data: Data;
      };
      const { data } = response;

      if (!data) {
        yield refreshListsHandler();
        return;
      }

      if (!data.lists || !data.version) throw new Error("No lists");

      yield put(setLists(data.lists));
      yield put(setVersion(data.version));
      yield put(
        openModal({
          message: { key: "modal.removeList.message.success" },
          type: "success",
        })
      );
    } catch (error) {
      yield put(
        openModal({
          message: { key: "modal.removeList.message.error.default" },
          type: "error",
        })
      );
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
