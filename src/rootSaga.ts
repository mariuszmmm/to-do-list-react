import { all } from "redux-saga/effects";
import { tasksSaga } from "./features/tasks/tasksSaga";
import { listsSaga } from "./features/ListsPage/listsSaga";

export default function* rootSaga() {
  yield all([tasksSaga(), listsSaga()]);
}
