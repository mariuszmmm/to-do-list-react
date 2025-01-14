import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import Navigation from "./Navigation";
import TaskPage from "./features/tasks/TaskPage";
import TasksPage from "./features/tasks/TasksPage";
import AuthorPage from "./features/AuthorPage";
import Container from "./common/Container";
import CurrentDate from "./common/CurrentDate";
import ListsPage from "./features/ListsPage";

const App = () => {

  return (
    <HashRouter>
      <Navigation />
      <Container>
        <CurrentDate />
        <Routes>
          <Route path="/zadania/:id" element={<TaskPage />} />
          <Route path="/zadania" element={<TasksPage />} />
          <Route path="/listy" element={<ListsPage />} />
          <Route path="/autor" element={<AuthorPage />} />
          <Route path="/" element={<Navigate to="/zadania" />} />
        </Routes>
      </Container>
    </ HashRouter>
  )
};

export default App;