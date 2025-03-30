export type Version = number | null;

export interface AccountState {
  accountMode:
    | "login"
    | "logged"
    | "changePassword"
    | "registerAccount"
    | "accountRecovery";
  isWaitingForConfirmation: boolean;
  loggedUserEmail: string | null;
  message: string;
  version: Version;
}

export type RecoveryStatus =
  | "recovering"
  | "resetPassword"
  | "linkExpired"
  | "passwordUpdated"
  | "passwordNotUpdated"
  | "savePassword";

export interface Task {
  id: string;
  content: string;
  done: boolean;
  date: Date;
  doneDate?: Date | null;
  editedDate?: Date | null;
}

export interface List {
  id: string;
  name: string;
  taskList: Task[];
}

export interface Data {
  email: string;
  lists: List[];
  version: Version;
}

export interface Translation {
  navigation: {
    tasks: "Tasks" | "Zadania";
    lists: "Lists" | "Listy";
    author: "About author" | "O autorze";
  };
  currentDate: "Today is " | "Dziś jest ";
  tasks: {
    title: "Task List" | "Lista zadań";
    mainForm: {
      title: {
        addTask: "Add new task" | "Dodaj nowe zadanie";
        editTask: "Edit task" | "Edytuj zadanie";
      };
      buttons: {
        fetchExampleTasks:
          | "Fetch example tasks"
          | "Pobierz przykładowe zadania";
      };
      inputPlaceholder: "What to do ?" | "Co jest do zrobienia ?";
      inputButton: {
        addTask: "Add task" | "Dodaj zadanie";
        saveChanges: "Save changes" | "Zapisz zmiany";
      };
    };
  };
}
