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
  savePasswordRequest,
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
import { clearLocalStorage } from "../../utils/localStorage";

function* accountRecoveryHandler({
  payload: { email },
}: ReturnType<typeof accountRecoveryRequest>): Generator {
  try {
    yield put(
      openModal({
        title: "Odzyskiwanie konta",
        message: "Trwa odzyskiwanie konta...",
        type: "loading",
      })
    );
    yield auth.requestPasswordRecovery(email);
    yield put(
      openModal({
        message:
          "Na podany adres e-mail został wysłany link do zresetowania hasła. Jeśli nie otrzymałeś wiadomości, spróbuj ponownie za 15 minut.",
        type: "info",
      })
    );
    yield put(setAccountMode("login"));
  } catch (error: any) {
    switch (error.status) {
      case undefined:
        yield put(
          openModal({
            message: "Brak połączenia z internetem.",
            type: "error",
          })
        );
        break;
      case 404:
        yield put(
          openModal({
            message: "Nie znaleziono użytkownika z tym adresem e-mail.",
            type: "error",
          })
        );
        break;
      default:
        yield put(
          openModal({
            message: "Błąd odzyskiwania hasła.",
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
      title: "Usuwanie konta",
      message: "Czy na pewno chcesz usunąć swoje konto?",
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
      const user = auth.currentUser();
      const userToken = (yield call(getUserToken)) as string | null;

      if (!userToken || !user) {
        yield put(setLoggedUserEmail(null));
        throw new Error("Użytkownik został wylogowany");
      }

      yield put(
        openModal({
          message: "Trwa usuwanie konta...",
          type: "loading",
        })
      );

      const response = (yield call(deleteUserApi, user.token.access_token)) as {
        statusCode: number;
      };
      if (response.statusCode !== 204) throw new Error();

      yield put(
        openModal({
          message: "Konto zostało usunięte.",
          type: "success",
        })
      );
      yield put(setLoggedUserEmail(null));
      yield delay(2000);
      yield put(
        openModal({
          title: "Czyszczenie danych",
          message: "Czy chcesz usunąć wszystkie dane z aplikacji?",
          type: "confirm",
          confirmButtonText: "Usuń",
        })
      );

      const { confirmed, canceled } = (yield race({
        confirmed: take(confirm.type),
        canceled: take(cancel.type),
      })) as { confirmed: TakeEffect; canceled: TakeEffect };

      if (confirmed) {
        yield put(clearStorage());
        yield call(clearLocalStorage);
        yield put(
          openModal({
            title: "Czyszczenie danych",
            message: "Wszystkie dane zostały usunięte.",
            type: "info",
          })
        );
      } else if (canceled) {
        yield put(closeModal());
      }
    } catch (error: any) {
      yield put(
        openModal({
          message: "Błąd podczas usuwania konta.",
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
        title: "Logowanie",
        message: "Trwa logowanie...",
        type: "loading",
      })
    );
    const response = (yield auth.login(email, password, true)) as User;
    yield put(setAccountMode("logged"));
    yield put(setLoggedUserEmail(response.email));
    yield put(
      openModal({
        title: "Logowanie",
        message: `Zalogowany jako ${response.email}`,
        type: "success",
      })
    );
  } catch (error: any) {
    switch (error.status) {
      case undefined:
        yield put(
          openModal({
            message: "Brak połączenia z internetem.",
            type: "error",
          })
        );
        break;
      case 400:
        yield put(
          openModal({
            message:
              "Nie znaleziono użytkownika z tym adresem e-mail lub hasło jest nieprawidłowe.",
            type: "error",
          })
        );
        break;
      default:
        yield put(
          openModal({
            message: "Błąd logowania",
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
      title: "Wylogowanie",
      message: "Czy na pewno chcesz się wylogować?",
      type: "confirm",
      confirmButtonText: "Wyloguj",
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
          message: "Trwa wylogowywanie...",
          type: "loading",
        })
      );
      const user: User | null = auth.currentUser();
      if (!user) throw new Error("Brak użytkownika");
      yield user.logout();
      yield put(setLoggedUserEmail(null));
      yield put(
        openModal({
          message: "Zostałeś wylogowany.",
          type: "success",
        })
      );
    } catch (error: any) {
      yield put(
        openModal({
          message: "Błąd wylogowania.",
          type: "error",
        })
      );
      yield put(setLoggedUserEmail(null));
    }
  } else if (canceled) {
    yield put(closeModal());
  }
}

function* savePasswordHandler({
  payload: { password },
}: ReturnType<typeof savePasswordRequest>): Generator {
  const user = auth.currentUser();
  const userToken = (yield call(getUserToken)) as string;

  try {
    yield put(
      openModal({
        title: "Zmiana hasła",
        message: "Trwa zmiana hasła...",
        type: "loading",
      })
    );

    if (!userToken || !user) {
      yield put(setLoggedUserEmail(null));
      throw new Error("Użytkownik został wylogowany");
    }

    yield user.update({ password });
    yield put(
      openModal({
        message: "Hasło zostało zmienione.",
        type: "success",
      })
    );
    yield put(setAccountMode("logged"));
  } catch (error: any) {
    yield put(
      openModal({
        message: "Błąd podczas zmiany hasła.",
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
      title: "Rejestracja konta",
      message: "Trwa rejestracja...",
      type: "loading",
    })
  );

  try {
    yield auth.signup(email, password);
    yield put(setIsWaitingForConfirmation(true));
    yield put(
      openModal({
        message:
          "Na podany adres e-mail został wysłany link do rejestracji konta.",
        type: "info",
      })
    );
  } catch (error: any) {
    switch (error.status) {
      case undefined:
        yield put(
          openModal({
            message: "Brak połączenia z internetem.",
            type: "error",
          })
        );
        break;
      case "Unable to validate email address: invalid format":
        yield put(
          openModal({ message: "Błędny format adresu e-mail.", type: "error" })
        );
        break;
      case 422:
        yield put(
          openModal({
            message:
              "Nie można zweryfikować adresu e-mail: nieprawidłowy format.",
            type: "error",
          })
        );
        break;
      case 400:
        yield put(
          openModal({
            message: "Użytkownik z tym adresem e-mail jest już zarejestrowany.",
            type: "error",
          })
        );
        break;
      default:
        yield put(openModal({ message: "Błąd rejestracji", type: "error" }));
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
  yield takeLatest(savePasswordRequest.type, savePasswordHandler);
  yield takeLatest(registerRequest.type, registerHandler);
}
