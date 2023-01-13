import { useLocalStorageState } from "./useLocalStorageState";

export const useTasks = () => {
   const [tasks, setTasks] = useLocalStorageState("tasks", []);

   const removeTasks = (id) => {
      setTasks(tasks => tasks.filter(task => task.id !== id));
   };

   const toggleTaskDone = (id) => {
      setTasks(tasks => tasks.map(task =>
         task.id === id ? { ...task, done: !task.done } : task
      ));
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

   return {
      tasks,
      removeTasks,
      toggleTaskDone,
      setAllDone,
      addNewTask,
   };
};

