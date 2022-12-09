import { useState } from 'react';
import Form from "./Form";
import Tasks from "./Tasks";
import Buttons from "./Buttons";
import Section from "./Section";
import Header from "./Header";
import Container from "./Container";

const tasks = [
  { id: 1, content: "Przejść na Reacta", done: true },
  { id: 2, content: "Napić się", done: false },
];

function App() {
  const [hideDone, sethideDone] = useState(false);

  const togglehideDone = () => {
    sethideDone(hideDone => !hideDone);
    console.log(hideDone);
  };

  return (
    <Container className="container">
      <Header title="Lista zadań" />
      <Section
        title="Dodaj nowe zadanie"
        body={<Form />}
      />
      <Section
        title="Lista zadań"
        body={
          <Tasks tasks={tasks} hideDone={hideDone} />
        }
        extraHeaderContent={
          <Buttons
            tasks={tasks}
            hideDone={hideDone}
            togglehideDone={togglehideDone}
          />
        }
      />
    </Container>
  );
}

export default App;
