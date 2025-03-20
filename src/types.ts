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
  version: Version;
}
