export type Version = number | null;

export interface AccountState {
  accountMode:
    | "login"
    | "logged"
    | "passwordChange"
    | "accountRegister"
    | "accountRecovery"
    | "accountDelete"
    | "dataRemoval";
  isWaitingForConfirmation: boolean;
  loggedUserEmail: string | null;
  message: string;
  version: Version;
}

export type RecoveryStatus =
  | "linkExpired"
  | "accountRecovered"
  | "passwordChange";
