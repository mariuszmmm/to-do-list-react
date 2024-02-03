import { HashRouter, Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import Tasks from "./features/tasks/TasksPage";
import AuthorPage from "./features/author/AutorPage";
import { Nav, NavList, StyledNavLink } from "./styled";
import Task from "./features/tasks/TaskPage";

const App = () => {

  return (
    <HashRouter>
      <Nav>
        <NavList>
          <li><StyledNavLink to="/zadania">Zadania</StyledNavLink></li>
          <li><StyledNavLink to="/autor">O autorze</StyledNavLink></li>
        </NavList>
      </Nav>
      <Routes>
        <Route path="/zadania/:id" element={<Task />} />
        <Route path="/zadania" element={<Tasks />} />
        <Route path="/autor" element={<AuthorPage />} />
        <Route path="/" element={<Navigate to="/zadania" />} />
      </Routes>
    </ HashRouter>
  )
};

export default App;