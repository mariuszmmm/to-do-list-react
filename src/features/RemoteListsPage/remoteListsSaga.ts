import { put, delay, select, takeLatest } from "redux-saga/effects";
import { selectToUpdate, setToUpdate } from "../tasks/tasksSlice";

export function* pollDataSaga() {
  while (true) {
    const toUpdate: ReturnType<typeof selectToUpdate> = yield select(
      selectToUpdate
    );

    console.log("pollDataSaga - toUpdate:", toUpdate);

    if (toUpdate === null) {
      console.log("Pętla zatrzymana, flaga isRunning = false");
      break;
    }

    console.log("Pobieranie danych...");
    yield delay(5000);

    //     try {
    //   const data = yield call(fetchData);
    //   yield put(listToAdd(data));
    // } catch (error) {
    //   console.error("Błąd podczas pobierania:", error);
    // }
    yield put(setToUpdate(null));
  }
}

export function* remoteListsSaga() {
  // yield takeLatest(setToUpdate.type, pollDataSaga);
}
