import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import Tasks from "./features/tasks/Tasks";
import AboutAutor from "./features/aboutAutor/AboutAutor";
import { Nav, NavList, StyledNavLink } from "./styled";

const App = () => (
  <HashRouter>
    <Nav>
      <NavList>
        <li><StyledNavLink to="/zadania">Zadania</StyledNavLink></li>
        <li><StyledNavLink to="/autor">O autorze</StyledNavLink></li>
      </NavList>
    </Nav>
    <Routes>
      <Route path="/zadania" element={<Tasks />} />
      <Route path="/autor" element={<AboutAutor />} />
      <Route path="/" element={<Navigate to="/zadania" />} />
    </Routes>
  </ HashRouter>
);

export default App;