import {
  call,
  delay,
  put,
  race,
  take,
  TakeEffect,
  takeLatest,
} from "redux-saga/effects";
import {
  accountRecoveryRequest,
  deleteAccountRequest,
  loginRequest,
  logoutRequest,
  registerRequest,
  changePasswordRequest,
  setAccountMode,
  setIsWaitingForConfirmation,
  setLoggedUserEmail,
} from "./accountSlice";
import { clearStorage } from "../tasks/tasksSlice";
import { cancel, closeModal, confirm, openModal } from "../../Modal/modalSlice";
import { auth } from "../../api/auth";
import { deleteUserApi } from "../../api/fetchUserApi";
import { getUserToken } from "../../utils/getUserToken";
import { User } from "gotrue-js";

function* accountRecoveryHandler({
  payload: { email },
}: ReturnType<typeof accountRecoveryRequest>): Generator {
  try {
    yield put(
      openModal({
        title: { key: "modal.recoveryAccount.title" },
        message: { key: "modal.recoveryAccount.message.loading" },
        type: "loading",
      })
    );
    yield auth.requestPasswordRecovery(email);
    yield put(
      openModal({
        message: { key: "modal.recoveryAccount.message.info" },
        type: "info",
      })
    );
    yield put(setAccountMode("login"));
  } catch (error: any) {
    switch (error.status) {
      case undefined:
        yield put(
          openModal({
            message: {
              key: "modal.recoveryAccount.message.error.noConnection",
            },
            type: "error",
          })
        );
        break;
      case 404:
        yield put(
          openModal({
            message: { key: "modal.recoveryAccount.message.error.notFound" },
            type: "error",
          })
        );
        break;
      default:
        yield put(
          openModal({
            message: { key: "modal.recoveryAccount.message.error.default" },
            type: "error",
          })
        );
        break;
    }
  }
}

function* deleteAccountHandler(): Generator {
  yield put(
    openModal({
      title: { key: "modal.deleteAccount.title" },
      message: { key: "modal.deleteAccount.message.confirm" },
      confirmButton: { key: "modal.buttons.deleteButton" },
      type: "confirm",
    })
  );

  const { confirmed, canceled } = (yield race({
    confirmed: take(confirm.type),
    canceled: take(cancel.type),
  })) as { confirmed: TakeEffect; canceled: TakeEffect };

  if (confirmed) {
    try {
      const user = auth.currentUser();
      const userToken = (yield call(getUserToken)) as string | null;

      if (!userToken || !user) {
        yield put(setLoggedUserEmail(null));
        throw new Error("User is logged out");
      }

      yield put(
        openModal({
          message: { key: "modal.deleteAccount.message.loading" },
          type: "loading",
        })
      );

      const response = (yield call(deleteUserApi, user.token.access_token)) as {
        statusCode: number;
      };
      if (response.statusCode !== 204) throw new Error();
      yield put(
        openModal({
          message: { key: "modal.deleteAccount.message.success" },
          type: "success",
        })
      );
      yield put(setLoggedUserEmail(null));
      yield delay(2000);
      yield put(
        openModal({
          title: { key: "modal.dataRemoval.title" },
          message: { key: "modal.dataRemoval.message.confirm" },
          confirmButton: { key: "modal.buttons.deleteButton" },
          type: "confirm",
        })
      );

      const { confirmed, canceled } = (yield race({
        confirmed: take(confirm.type),
        canceled: take(cancel.type),
      })) as { confirmed: TakeEffect; canceled: TakeEffect };

      if (confirmed) {
        yield put(clearStorage());
        yield put(
          openModal({
            title: { key: "modal.dataRemoval.title" },
            message: { key: "modal.dataRemoval.message.info" },
            type: "info",
          })
        );
      } else if (canceled) {
        yield put(closeModal());
      }
    } catch (error: any) {
      yield put(
        openModal({
          message: { key: "modal.deleteAccount.message.error.default" },
          type: "error",
        })
      );
    }
  } else if (canceled) {
    yield put(closeModal());
  }
}

function* loginHandler({
  payload: { email, password },
}: ReturnType<typeof loginRequest>): Generator {
  if (!email || !password) return;

  try {
    yield put(
      openModal({
        title: { key: "modal.login.title" },
        message: { key: "modal.login.message.loading" },
        type: "loading",
      })
    );
    const response = (yield auth.login(email, password, true)) as User;

    yield put(
      openModal({
        message: {
          key: "modal.login.message.success",
          values: { user: response.email },
        },
        type: "success",
      })
    );

    yield take(closeModal.type);
    yield put(setAccountMode("logged"));
    yield put(setLoggedUserEmail(response.email));
  } catch (error: any) {
    switch (error.status) {
      case undefined:
        yield put(
          openModal({
            message: { key: "modal.login.message.error.noConnection" },
            type: "error",
          })
        );
        break;
      case 400:
        yield put(
          openModal({
            message: { key: "modal.login.message.error.notFound" },
            type: "error",
          })
        );
        break;
      default:
        yield put(
          openModal({
            message: { key: "modal.login.message.error.default" },
            type: "error",
          })
        );
        break;
    }
  }
}

function* logoutHandler(): Generator {
  yield put(
    openModal({
      title: { key: "modal.logout.title" },
      message: { key: "modal.logout.message.confirm" },
      confirmButton: { key: "modal.buttons.logoutButton" },
      type: "confirm",
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
          message: { key: "modal.logout.message.loading" },
          type: "loading",
        })
      );
      const user: User | null = auth.currentUser();
      if (!user) throw new Error("No user found");
      yield user.logout();
      yield put(setLoggedUserEmail(null));
      yield put(
        openModal({
          message: { key: "modal.logout.message.success" },
          type: "success",
        })
      );
    } catch (error: any) {
      yield put(
        openModal({
          message: { key: "modal.logout.message.error.default" },
          type: "error",
        })
      );
    }
  } else if (canceled) {
    yield put(closeModal());
  }
}

function* changePasswordHandler({
  payload: { password },
}: ReturnType<typeof changePasswordRequest>): Generator {
  const user = auth.currentUser();
  const userToken = (yield call(getUserToken)) as string;

  try {
    yield put(
      openModal({
        title: { key: "modal.changePassword.title" },
        message: { key: "modal.changePassword.message.loading" },
        type: "loading",
      })
    );

    if (!userToken || !user) {
      yield put(setLoggedUserEmail(null));
      throw new Error("User is logged out");
    }

    yield user.update({ password });
    yield put(
      openModal({
        message: { key: "modal.changePassword.message.success" },
        type: "success",
      })
    );
    yield put(setAccountMode("logged"));
  } catch (error: any) {
    yield put(
      openModal({
        message: { key: "modal.changePassword.message.error.default" },
        type: "error",
      })
    );
  }
}

function* registerHandler({
  payload: { email, password },
}: ReturnType<typeof registerRequest>): Generator {
  yield put(
    openModal({
      title: { key: "modal.registerAccount.title" },
      message: { key: "modal.registerAccount.message.loading" },
      type: "loading",
    })
  );

  try {
    yield auth.signup(email, password);
    yield put(setIsWaitingForConfirmation(true));
    yield put(
      openModal({
        message: { key: "modal.registerAccount.message.info" },
        type: "info",
      })
    );
  } catch (error: any) {
    switch (error.status) {
      case undefined:
        yield put(
          openModal({
            message: {
              key: "modal.registerAccount.message.error.noConnection",
            },
            type: "error",
          })
        );
        break;
      case "Unable to validate email address: invalid format":
        yield put(
          openModal({
            message: { key: "modal.registerAccount.message.error.emailFormat" },
            type: "error",
          })
        );
        break;
      case 422:
        yield put(
          openModal({
            message: {
              key: "modal.registerAccount.message.error.invalidEmail",
            },
            type: "error",
          })
        );
        break;
      case 400:
        yield put(
          openModal({
            message: { key: "modal.registerAccount.message.error.userExists" },
            type: "error",
          })
        );
        break;
      default:
        yield put(
          openModal({
            message: { key: "modal.registerAccount.message.error.default" },
            type: "error",
          })
        );
        break;
    }
    return;
  }
}

export function* accountSaga() {
  yield takeLatest(accountRecoveryRequest.type, accountRecoveryHandler);
  yield takeLatest(deleteAccountRequest.type, deleteAccountHandler);
  yield takeLatest(loginRequest.type, loginHandler);
  yield takeLatest(logoutRequest.type, logoutHandler);
  yield takeLatest(changePasswordRequest.type, changePasswordHandler);
  yield takeLatest(registerRequest.type, registerHandler);
}
