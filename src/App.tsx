import { HashRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Navigation from "./Navigation";
import TaskPage from "./features/tasks/TaskPage";
import TasksPage from "./features/tasks/TasksPage";
import InfoPage from "./features/InfoPage";
import AccountPage from "./features/AccountPage";
import UserConfirmationPage from "./features/UserConfirmationPage";
import AccountRecoveryPage from "./features/AccountRecoveryPage";
import { Container } from "./common/Container";
import { CurrentDate } from "./common/CurrentDate";
import { Modal } from "./Modal";
import { TokenManager } from "./components/TokenManager";
import { AblyManager } from "./components/AblyManager";
import { useQuery } from "@tanstack/react-query";
import { refreshData } from "./utils/refreshData";
import { selectLoggedUserEmail, setPresenceData } from "./features/AccountPage/accountSlice";
import { ListsData } from "./types";
import RemoteListsPage from "./features/RemoteListsPage";
import ArchivedListsPage from "./features/ArchivedListPage";
import {
  useAppDispatch,
  useAppSelector,
  useDataFetchingError,
  useSaveListMutation,
  useListSyncManager,
  useAblySubscription,
} from "./hooks";
import { selectTaskListMetaData } from "./features/tasks/tasksSlice";


const AppContent = () => {
  const loggedUserEmail = useAppSelector(selectLoggedUserEmail);
  const navigate = useNavigate();
  const { data, isLoading, isError } = useQuery<ListsData>({
    queryKey: ["listsData"],
    queryFn: refreshData,
    enabled: !!loggedUserEmail,
    refetchInterval: 5 * 60 * 1000,
  });
  const safeData = !!loggedUserEmail ? data : undefined;
  const authRoutes = ["/user-confirmation", "/account-recovery"];
  const saveListMutation = useSaveListMutation();
  const { id: localListId } = useAppSelector(selectTaskListMetaData);
  const dispatch = useAppDispatch();

  useDataFetchingError({ loggedUserEmail, isError });
  useListSyncManager({ listsData: safeData, saveListMutation });
  useAblySubscription({
    userEmail: loggedUserEmail,
    enabled: !!loggedUserEmail,
    onPresenceUpdate: (data) => {
      dispatch(setPresenceData(data));
    }
  });

  // Handle Google OAuth callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (code) {
      // Store code and redirect to account page
      sessionStorage.setItem("google_oauth_code", code);
      window.history.replaceState({}, document.title, window.location.pathname);
      navigate("/account");
    }
  }, [navigate]);

  process.env.NODE_ENV === "development" && console.log("Rendering App component...");

  return (
    <>
      <TokenManager />
      <AblyManager />
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
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
};

export default App;