import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
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


const App = () => {
  const loggedUserEmail = useAppSelector(selectLoggedUserEmail);
  const { data, isLoading, isError } = useQuery<ListsData>({
    queryKey: ["listsData"],
    queryFn: refreshData,
    enabled: !!loggedUserEmail,
    // refetchInterval: 60 * 1000,
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

  process.env.NODE_ENV === "development" && console.log("App component rendered. Logged user:", loggedUserEmail);

  return (
    <HashRouter>
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
    </HashRouter>
  );
};

export default App;