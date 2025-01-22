export interface AccountState {
  loggedUser: string | null;
  accountMode:
    | "login"
    | "logged"
    | "changePassword"
    | "savePassword"
    | "registerAccount"
    | "sendRegisterEmail"
    | "deleteUser"
    | "accountRecovery"
    | "sendRecoveryEmail";
  fetchStatus: "idle" | "loading" | "error";
  message?: {
    text: string;
    type: "info" | "warning";
  };
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
  date: string;
  doneDate?: string | null;
  editedDate?: string | null;
}

export interface List {
  id: string;
  name: string;
  taskList: Task[];
}

export interface Data {
  email: string;
  lists: List[];
}
