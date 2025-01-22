import { all } from "redux-saga/effects";
import { accountSaga } from "./features/AccountPage/accountSaga";
import { listsSaga } from "./features/ListsPage/listsSaga";
import { tasksSaga } from "./features/tasks/tasksSaga";

export default function* rootSaga() {
  yield all([accountSaga(), listsSaga(), tasksSaga()]);
}
