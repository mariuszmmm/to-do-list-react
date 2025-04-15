import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./hooks/redux";
import Navigation from "./Navigation";
import TaskPage from "./features/tasks/TaskPage";
import TasksPage from "./features/tasks/TasksPage";
import AuthorPage from "./features/AuthorPage";
import ListsPage from "./features/ListsPage";
import AccountPage from "./features/AccountPage";
import UserConfirmationPage from "./features/UserConfirmationPage";
import AccountRecoveryPage from "./features/AccountRecoveryPage";
import { Container } from "./common/Container";
import { CurrentDate } from "./common/CurrentDate";
import {
  selectIsListsSorting,
  selectLists,
  setLists,
} from "./features/ListsPage/listsSlice";
import { Modal } from "./Modal";
import { useEffect } from "react";
import { auth } from "./api/auth";
import { refreshData } from "./utils/refreshData";
import { setVersion } from "./features/AccountPage/accountSlice";

const App = () => {
  const lists = useAppSelector(selectLists);
  const isListsSorting = useAppSelector(selectIsListsSorting);
  const dispatch = useAppDispatch();
  const user = auth.currentUser();

  useEffect(() => {
    if (!user || isListsSorting) return;

    const interval = setInterval(async () => {
      const data = await refreshData();
      if (!data || !data.lists || !data.version) return;
      dispatch(setLists(data.lists));
      dispatch(setVersion(data.version));
    }, 1000 * 60);

    return () => {
      clearInterval(interval);
    };
  }, [user, isListsSorting, dispatch]);

  return (
    <HashRouter>
      <Navigation />
      <Container>
        <CurrentDate />
        <Routes>
          <Route path="/account-recovery" element={<AccountRecoveryPage />} />
          <Route path="/user-confirmation" element={<UserConfirmationPage />} />
          <Route path="/tasks/:id" element={<TaskPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          {lists && <Route path="/lists" element={<ListsPage />} />}
          <Route path="/author" element={<AuthorPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="*" element={<Navigate to="/tasks" />} />
        </Routes>
      </Container>
      <Modal />
    </HashRouter>
  );
};

export default App;
