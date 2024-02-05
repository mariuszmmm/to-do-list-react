import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import Navigation from "./Navigation";
import TaskPage from "./features/tasks/TaskPage";
import TasksPage from "./features/tasks/TasksPage";
import AuthorPage from "./features/AuthorPage";

const App = () => {

  return (
    <HashRouter>
      <Navigation />

      <Routes>
        <Route path="/zadania/:id" element={<TaskPage />} />
        <Route path="/zadania" element={<TasksPage />} />
        <Route path="/autor" element={<AuthorPage />} />
        <Route path="/" element={<Navigate to="/zadania" />} />
      </Routes>
    </ HashRouter>
  )
};

export default App;