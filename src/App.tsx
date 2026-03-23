import React from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import Navigation from "./Navigation";
import TaskPage from "./features/tasks/TaskPage";
import TasksPage from "./features/tasks/TasksPage";
import InfoPage from "./features/InfoPage";
import AccountPage from "./features/AccountPage";
import UserConfirmationPage from "./features/UserConfirmationPage";
import UserInvitationPage from "./features/UserInvitationPage";
import AccountRecoveryPage from "./features/AccountRecoveryPage";
import RemoteListsPage from "./features/RemoteListsPage";
import ArchivedListsPage from "./features/ArchivedListPage";

import { Container } from "./common/Container";
import { CurrentDate } from "./common/CurrentDate";
import { Modal } from "./Modal";
import { NotificationModal } from "./features/tasks/TasksPage/NotificationModal";
import { TokenManager } from "./components/TokenManager";
import { AblyManager } from "./components/AblyManager";
import { ListSyncManager } from "./components/ListSyncManager";
import { OfflineManager } from "./components/OfflineManager";
import { SessionManager } from "./components/SessionManager";
import { NotificationManager } from "./components/NotificationManager";

import { refreshData } from "./utils/sync/refreshData";
import { selectLoggedUserEmail } from "./features/AccountPage/accountSlice";
import { ListsData } from "./types";
import { selectTaskListMetaData } from "./features/tasks/tasksSlice";
import {
  useAppSelector,
  useDataFetchingError,
  useSaveListMutation,
  useOnlineStatus,
} from "./hooks";
import { ThemeSwitch } from "./common/ThemeSwitch";
import { HeaderControls } from "./common/HeaderControls";
import { TaskImage } from "./features/tasks/TaskImage";
import { UpdateNotification } from "./common/UpdateNotification";

const App = () => {
  const loggedUserEmail = useAppSelector(selectLoggedUserEmail);
  const isOnline = useOnlineStatus();
  const { data, isLoading, isError, refetch } = useQuery<ListsData>({
    queryKey: ["listsData"],
    queryFn: refreshData,
    enabled: !!loggedUserEmail && isOnline,
    refetchInterval: 5 * 60 * 1000,
  });
  const safeData = !!loggedUserEmail && isOnline ? data : undefined;
  const authRoutes = [
    "/user-confirmation",
    "/account-recovery",
    "/user-invitation",
  ];
  const saveListMutation = useSaveListMutation();
  const { id: localListId } = useAppSelector(selectTaskListMetaData);
  useDataFetchingError({ isError, isData: !!safeData, refetch });

  return (
    <HashRouter>
      {(() => {
        const { hash } = window.location;
        if (!authRoutes.some((route) => hash.startsWith(`#${route}`))) {
          return (
            <>
              <SessionManager authRoutes={authRoutes} />
              <Navigation
                listsData={safeData}
                isLoading={isLoading}
                isError={isError}
                authRoutes={authRoutes}
                isOnline={isOnline}
              />
              <TokenManager />
              <AblyManager
                userEmail={loggedUserEmail}
                enabled={!!loggedUserEmail}
              />
              <ListSyncManager
                listsData={safeData}
                saveListMutation={saveListMutation}
              />
              <NotificationManager />
              <OfflineManager refetch={refetch} />
            </>
          );
        }
        return null;
      })()}

      <Container>
        <HeaderControls>
          <ThemeSwitch authRoutes={authRoutes} />
          <CurrentDate authRoutes={authRoutes} />
        </HeaderControls>
        <Routes>
          <Route path="/account-recovery" element={<AccountRecoveryPage />} />
          <Route path="/user-confirmation" element={<UserConfirmationPage />} />
          <Route path="/user-invitation" element={<UserInvitationPage />} />
          <Route
            path="/tasks/image/:id"
            element={
              <TaskImage listsData={safeData} localListId={localListId} />
            }
          />
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
              element={
                <RemoteListsPage
                  listsData={safeData}
                  localListId={localListId}
                />
              }
            />
          )}
          <Route path="/info" element={<InfoPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="*" element={<Navigate to="/tasks" />} />
        </Routes>
      </Container>
      <Modal />
      <NotificationModal />
      <UpdateNotification />
    </HashRouter>
  );
};

export default App;
