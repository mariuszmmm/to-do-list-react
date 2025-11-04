import { all } from "redux-saga/effects";

import { archivedListSaga } from "./features/ArchivedListPage/archivedListSaga";
import { tasksSaga } from "./features/tasks/tasksSaga";

export default function* rootSaga() {
  yield all([tasksSaga(), archivedListSaga()]);
}
