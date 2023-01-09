import { useState, useEffect } from 'react';
import Form from "./Form";
import Tasks from "./Tasks";
import Buttons from "./Buttons";
import Section from "./Section";
import Header from "./Header";
import Container from "./Container";

const getDataFromLocalStorage = (name) => JSON.parse(localStorage.getItem(name));

function App() {
  const [hideDone, setHideDone] = useState(getDataFromLocalStorage("hideDone"));
  const [tasks, setTasks] = useState(getDataFromLocalStorage("tasks") || []);

  useEffect(() => {
    localStorage.setItem("hideDone", JSON.stringify(hideDone));
  }, [hideDone]);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const togglehideDone = () => {
    setHideDone(hideDone => !hideDone);
  };

  const removeTasks = (id) => {
    setTasks(tasks => tasks.filter(task => task.id !== id));
  };

  const toggleTaskDone = (id) => {
    setTasks(tasks => tasks.map(task => {
      if (task.id === id) {
        return { ...task, done: !task.done };
      }

      return task;
    }));
  };

  const setAllDone = () => {
    setTasks(tasks => tasks.map(task => ({
      ...task,
      done: true,
    })));
  };

  const addNewTask = (content) => {
    setTasks(tasks => [
      ...tasks,
      {
        content,
        done: false,
        id: tasks.length ? tasks[tasks.length - 1].id + 1 : 1,
      },
    ]);
  };

  return (
    <Container className="container">
      <Header title="Lista zadań" />
      <Section
        title="Dodaj nowe zadanie"
        body={<Form addNewTask={addNewTask} />}
      />
      <Section
        title="Lista zadań"
        body={
          <Tasks
            tasks={tasks}
            hideDone={hideDone}
            removeTasks={removeTasks}
            toggleTaskDone={toggleTaskDone}
          />
        }
        extraHeaderContent={
          <Buttons
            tasks={tasks}
            hideDone={hideDone}
            togglehideDone={togglehideDone}
            setAllDone={setAllDone}
          />
        }
      />
    </Container>
  );
}

export default App;
