import { all } from "redux-saga/effects";
import { tasksSaga } from "./features/tasks/tasksSaga";
import { archivedListSaga } from "./features/ArchivedListPage/archivedListSaga";
import { remoteListsSaga } from "./features/RemoteListsPage/remoteListsSaga";

export default function* rootSaga() {
  yield all([tasksSaga(), archivedListSaga(), remoteListsSaga()]);
}
