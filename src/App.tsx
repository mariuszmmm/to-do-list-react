import React from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import Navigation from "./Navigation";
import TaskPage from "./features/tasks/TaskPage";
import TasksPage from "./features/tasks/TasksPage";
import InfoPage from "./features/InfoPage";
import AccountPage from "./features/AccountPage";
import UserConfirmationPage from "./features/UserConfirmationPage";
import AccountRecoveryPage from "./features/AccountRecoveryPage";
import RemoteListsPage from "./features/RemoteListsPage";
import ArchivedListsPage from "./features/ArchivedListPage";

import { Container } from "./common/Container";
import { CurrentDate } from "./common/CurrentDate";
import { Modal } from "./Modal";
import { TokenManager } from "./components/TokenManager";
import { AblyManager } from "./components/AblyManager";
import { ListSyncManager } from "./components/ListSyncManager";
import { GoogleOAuthHandler } from "./components/GoogleOAuthHandler";

import { refreshData } from "./utils/refreshData";
import { selectLoggedUserEmail } from "./features/AccountPage/accountSlice";
import { ListsData } from "./types";
import { selectTaskListMetaData } from "./features/tasks/tasksSlice";
import {
  useAppSelector,
  useDataFetchingError,
  useSaveListMutation,
} from "./hooks";

const AppContent = () => {
  const loggedUserEmail = useAppSelector(selectLoggedUserEmail);
  const { data, isLoading, isError } = useQuery<ListsData>({
    queryKey: ["listsData"],
    queryFn: refreshData,
    enabled: !!loggedUserEmail,
    refetchInterval: 30 * 60 * 1000,
  });
  const safeData = !!loggedUserEmail ? data : undefined;
  const authRoutes = ["/user-confirmation", "/account-recovery"];
  const saveListMutation = useSaveListMutation();
  const { id: localListId } = useAppSelector(selectTaskListMetaData);
  useDataFetchingError({ loggedUserEmail, isError });

  process.env.NODE_ENV === "development" && console.log("Rendering App component...");

  return (
    <>
      <TokenManager />
      <AblyManager userEmail={loggedUserEmail} enabled={!!loggedUserEmail} />
      <ListSyncManager listsData={safeData} saveListMutation={saveListMutation} />
      <GoogleOAuthHandler />
      <Navigation
        listsData={safeData}
        isLoading={isLoading}
        isError={isError}
        authRoutes={authRoutes}
      />
      <Container>
        <CurrentDate authRoutes={authRoutes} />
        <Routes>
          <Route path="/account-recovery" element={<AccountRecoveryPage />} />
          <Route path="/user-confirmation" element={<UserConfirmationPage />} />
          <Route path="/tasks/:id" element={<TaskPage />} />
          <Route
            path="/tasks"
            element={
              <TasksPage
                listsData={safeData}
                saveListMutation={saveListMutation}
              />
            }
          />
          <Route path="/archived-lists" element={<ArchivedListsPage />} />
          {!!safeData && (
            <Route
              path="/lists"
              element={<RemoteListsPage listsData={safeData} localListId={localListId} />}
            />
          )}
          <Route path="/info" element={<InfoPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="*" element={<Navigate to="/tasks" />} />
        </Routes>
      </Container>
      <Modal />
    </>
  );
};

const App = () => {
  if (process.env.NODE_ENV === "development") {
    return (
      <React.StrictMode>
        <HashRouter>
          <AppContent />
        </HashRouter>
      </React.StrictMode>
    );
  }
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
};

export default App;