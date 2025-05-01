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
import { Modal } from "./Modal";
import { useQuery } from "@tanstack/react-query";
import { refreshData } from "./utils/refreshData";
import {
  selectLoggedUserEmail,
  setAccountMode,
  setLoggedUserEmail,
} from "./features/AccountPage/accountSlice";
import { ListsData } from "./types";
import { openModal } from "./Modal/modalSlice";
import { useEffect } from "react";
import { clearLocalStorage } from "./utils/localStorage";

const App = () => {
  const loggedUserEmail = useAppSelector(selectLoggedUserEmail);
  const dispatch = useAppDispatch();
  const { data, isLoading, isSuccess, isError } = useQuery<ListsData>({
    queryKey: ["lists"],
    queryFn: refreshData,
    enabled: !!loggedUserEmail,
  });
  const safeData = !!loggedUserEmail ? data : undefined;
  const authRoutes = ["/user-confirmation", "/account-recovery"];

  useEffect(() => {
    if (!loggedUserEmail) return;
    if (isLoading) {
      dispatch(
        openModal({
          title: { key: "modal.listsDownload.title" },
          message: { key: "modal.listsDownload.message.loading" },
          type: "loading",
        })
      );
    }
    if (isSuccess) {
      dispatch(
        openModal({
          title: { key: "modal.listsDownload.title" },
          message: { key: "modal.listsDownload.message.success" },
          type: "success",
        })
      );
    }
    if (isError) {
      clearLocalStorage();
      dispatch(setLoggedUserEmail(null));
      dispatch(setAccountMode("login"));
      dispatch(
        openModal({
          title: { key: "modal.listsDownload.title" },
          message: { key: "modal.listsDownload.message.error.default" },
          type: "error",
        })
      );
    }
  }, [loggedUserEmail, isLoading, isSuccess, isError, dispatch]);

  return (
    <HashRouter>
      <Navigation listsData={safeData} authRoutes={authRoutes} />
      <Container>
        <CurrentDate authRoutes={authRoutes} />
        <Routes>
          <Route path="/account-recovery" element={<AccountRecoveryPage />} />
          <Route path="/user-confirmation" element={<UserConfirmationPage />} />
          <Route path="/tasks/:id" element={<TaskPage />} />
          <Route path="/tasks" element={<TasksPage listsData={safeData} />} />
          {!!safeData && (
            <Route path="/lists" element={<ListsPage listsData={safeData} />} />
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
