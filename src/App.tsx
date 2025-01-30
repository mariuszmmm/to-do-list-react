import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import Navigation from "./Navigation";
import TaskPage from "./features/tasks/TaskPage";
import TasksPage from "./features/tasks/TasksPage";
import AuthorPage from "./features/AuthorPage";
import Container from "./common/Container";
import CurrentDate from "./common/CurrentDate";
import ListsPage from "./features/ListsPage";
import Account from "./features/Account";
import { useSelector } from "react-redux";
import { selectUser } from "./features/Account/loginSlice";
import { useEffect } from "react";
import { auth } from "./features/Account/auth";

const App = () => {
  const user = useSelector(selectUser);

  useEffect(() => {
    window.addEventListener("storage", (event) => {
      if (event.key === "auth_token" && event.newValue) {
        const token = event.newValue;
        console.log("auth_token", token);

        if (token) {
          const confirmation = async () => {
            try {
              const confirmed = await auth.confirm(token);
              console.log("Confirmed:", confirmed);

              if (confirmed) {
                console.log("logowanie");
                // login();
              }
            } catch (error) {
              console.error("Błąd potwierdzenia konta:", error);
            }

            // clearTokenFromLocalStorage();
          };

          confirmation();
        }
      }
    });

    // eslint-disable-next-line
  }, []);

  return (
    <HashRouter>
      <Navigation />
      <Container>
        <CurrentDate />
        <Routes>
          <Route path="/zadania/:id" element={<TaskPage />} />
          <Route path="/zadania" element={<TasksPage />} />
          {user && <Route path="/listy" element={<ListsPage />} />}
          <Route path="/autor" element={<AuthorPage />} />
          <Route path="/konto" element={<Account />} />
          <Route path="*" element={<Navigate to="/zadania" />} />
        </Routes>
      </Container>
    </HashRouter>
  );
};

export default App;
