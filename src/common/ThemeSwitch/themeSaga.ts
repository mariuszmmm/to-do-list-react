import { call, select, takeEvery } from "redux-saga/effects";
import { selectIsDarkTheme, toggleTheme } from "./themeSlice";
import { saveSettingsInLocalStorage } from "../../utils/localStorage";

function* saveSettingsInLocalStorageHandler() {
  const isDarkTheme: ReturnType<typeof selectIsDarkTheme> = yield select(
    selectIsDarkTheme
  );

  yield call(saveSettingsInLocalStorage, { isDarkTheme });
}

export function* themeSaga() {
  yield takeEvery(toggleTheme.type, saveSettingsInLocalStorageHandler);
}
