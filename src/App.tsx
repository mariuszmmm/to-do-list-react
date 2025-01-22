import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
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
import { getDataApi } from "./utils/fetchApi";
import { getUserTokenFromLocalStorage } from "./utils/localStorage";
import { selectLists, setLists } from "./features/ListsPage/listsSlice";

const App = () => {
  const dispatch = useAppDispatch();
  const lists = useAppSelector(selectLists);

  useEffect(() => {
    const token = getUserTokenFromLocalStorage();
    if (!token) return;
    const getData = async () => {
      const data = await getDataApi(token);
      if (lists === null && data) dispatch(setLists(data.lists));
    };

    getData();
  }, [lists, dispatch]);

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
    </HashRouter>
  );
};

export default App;
