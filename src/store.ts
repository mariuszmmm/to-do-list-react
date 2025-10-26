import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "./features/tasks/tasksSlice";
import remoteListsReducer from "./features/RemoteListsPage/remoteListsSlice";
import archivedListsReducer from "./features/ArchivedListPage/archivedListsSlice";
import accountReducer from "./features/AccountPage/accountSlice";
import modalReducer from "./Modal/modalSlice";
import createSagaMiddleware from "redux-saga";
import rootSaga from "./rootSaga";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    archivedLists: archivedListsReducer,
    remoteLists: remoteListsReducer,
    account: accountReducer,
    modal: modalReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
