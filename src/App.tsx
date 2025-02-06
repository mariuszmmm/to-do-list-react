import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import Navigation from "./Navigation";
import TaskPage from "./features/tasks/TaskPage";
import TasksPage from "./features/tasks/TasksPage";
import AuthorPage from "./features/AuthorPage";
import Container from "./common/Container";
import CurrentDate from "./common/CurrentDate";
import ListsPage from "./features/ListsPage";
import AccountPage from "./features/AccountPage";
import { useDispatch, useSelector } from "react-redux";
import { selectUserData, setUserData } from "./features/AccountPage/loginSlice";
import { useFetch } from "./hooks/useFetch";
import { auth } from "./utils/auth";
import { useEffect } from "react";
import { ConfirmationPage } from "./features/ConfirmationPage";
import { tokenConfirmation } from "./utils/tokenConfirmation";

const App = () => {
  const dispatch = useDispatch();
  const { getUserDataApi } = useFetch();
  const userData = useSelector(selectUserData);
  const user = auth.currentUser();

  const url = window.location.href;
  tokenConfirmation(url);

  useEffect(() => {
    const token = user?.token.access_token;
    if (!token) return;
    const getData = async () => {
      const data = await getUserDataApi(token);
      if (data) dispatch(setUserData(userData));
    };

    getData();
    // eslint-disable-next-line
  }, []);

  return (
    <HashRouter>
      <Navigation />
      <Container>
        <CurrentDate />
        <Routes>
          <Route path="/confirmation" element={<ConfirmationPage />} />
          <Route path="/zadania/:id" element={<TaskPage />} />
          <Route path="/zadania" element={<TasksPage />} />
          {userData && <Route path="/listy" element={<ListsPage />} />}
          <Route path="/autor" element={<AuthorPage />} />
          <Route path="/konto" element={<AccountPage />} />
          <Route path="*" element={<Navigate to="/zadania" />} />
        </Routes>
      </Container>
    </HashRouter>
  );
};

export default App;
