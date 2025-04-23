import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAppSelector } from "./hooks/redux";
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
import { Modal } from "./Modal";
import { useQuery } from "@tanstack/react-query";
import { refreshData } from "./utils/refreshData";
import { selectLoggedUserEmail } from "./features/AccountPage/accountSlice";

const App = () => {
  const loggedUserEmail = useAppSelector(selectLoggedUserEmail);
  const { data } = useQuery({
    queryKey: ["lists"],
    queryFn: refreshData,
    enabled: !!loggedUserEmail,
  });

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
          {!!data && !!loggedUserEmail && (
            <Route path="/lists" element={<ListsPage />} />
          )}
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
