import { all } from "redux-saga/effects";

import { archivedListSaga } from "./features/ArchivedListPage/archivedListSaga";
import { tasksSaga } from "./features/tasks/tasksSaga";
import { themeSaga } from "./common/ThemeSwitch/themeSaga";

export default function* rootSaga() {
  yield all([tasksSaga(), archivedListSaga(), themeSaga()]);
}
