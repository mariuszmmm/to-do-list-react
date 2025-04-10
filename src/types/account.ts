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
  | "changePassword";
