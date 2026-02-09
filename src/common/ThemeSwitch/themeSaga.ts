import { call, select, takeEvery } from "redux-saga/effects";
import { selectIsDarkTheme, toggleTheme } from "./themeSlice";
import { saveSettingsInLocalStorage } from "../../utils/storage/localStorage";

function* saveSettingsInLocalStorageHandler() {
  const isDarkTheme: ReturnType<typeof selectIsDarkTheme> = yield select(selectIsDarkTheme);

  yield call(saveSettingsInLocalStorage, { isDarkTheme });
  yield call(updateThemeColorMeta, isDarkTheme);
}

function updateThemeColorMeta(isDarkTheme: boolean) {
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');
  if (themeColorMeta) {
    const color = isDarkTheme ? "#151515ff" : "#007380";
    themeColorMeta.setAttribute("content", color);
  }
}

export function* themeSaga() {
  yield takeEvery(toggleTheme.type, saveSettingsInLocalStorageHandler);
}
