import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import Navigation from "./Navigation";
import TaskPage from "./features/tasks/TaskPage";
import TasksPage from "./features/tasks/TasksPage";
import AuthorPage from "./features/AuthorPage";
import Container from "./common/Container";
import CurrentDate from "./common/CurrentDate";
import ListsPage from "./features/ListsPage";
import Login from "./features/Login";
import netlifyIdentity from "netlify-identity-widget";
import { useEffect, useState } from "react";

netlifyIdentity.init();

const App = () => {
  const [user, setUser] = useState<netlifyIdentity.User | null>(null);
  const currentUser = netlifyIdentity.currentUser();
  useEffect(() => {
    netlifyIdentity.on("login", (user: netlifyIdentity.User) => {
      setUser(user);
      netlifyIdentity.close();
      console.log("login");
    });

    netlifyIdentity.on("logout", () => {
      setUser(null);
      netlifyIdentity.close();
      console.log("logout");
    });

    // if (currentUser) {
    //   setUser(currentUser);
    //   console.log("user");
    // }
  }, [user, currentUser]);
  console.log(user);

  return (
    <HashRouter>
      <Navigation />
      <Container>
        <CurrentDate />
        <Routes>
          <Route path="/zadania/:id" element={<TaskPage />} />
          <Route path="/zadania" element={<TasksPage />} />
          <Route
            path="/listy"
            element={user ? <ListsPage /> : <Navigate to="/login" />}
          />
          <Route path="/autor" element={<AuthorPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/zadania" />} />
        </Routes>
      </Container>
    </HashRouter>
  );
};

export default App;
