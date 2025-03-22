import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./hooks";
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
import { selectLists, setLists } from "./features/ListsPage/listsSlice";
import { Modal } from "./Modal";
import { useEffect } from "react";
import { auth } from "./api/auth";
import { refreshData } from "./utils/refreshData";
import { setVersion } from "./features/AccountPage/accountSlice";

const App = () => {
  const lists = useAppSelector(selectLists);
  const dispatch = useAppDispatch();
  const user = auth.currentUser();

  useEffect(() => {
    if (!user) return;

    const interval = setInterval(async () => {
      const data = await refreshData();
      if (!data) return;
      dispatch(setVersion(data.version));
      dispatch(setLists(data.lists));
    }, 1000 * 60);

    return () => {
      clearInterval(interval);
    };
  }, [user, dispatch]);

  return (
    <HashRouter>
      <Navigation />
      <Container>
        <CurrentDate />
        <Routes>
          <Route path="/account-recovery" element={<AccountRecoveryPage />} />
          <Route path="/user-confirmation" element={<UserConfirmationPage />} />
          <Route path="/zadania/:id" element={<TaskPage />} />
          <Route path="/zadania" element={<TasksPage />} />
          {lists && <Route path="/listy" element={<ListsPage />} />}
          <Route path="/autor" element={<AuthorPage />} />
          <Route path="/konto" element={<AccountPage />} />
          <Route path="*" element={<Navigate to="/zadania" />} />
        </Routes>
      </Container>
      <Modal />
    </HashRouter>
  );
};

export default App;
