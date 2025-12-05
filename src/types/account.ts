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
  presenceCount: number;
}

export type RecoveryStatus =
  | "linkExpired"
  | "accountRecovered"
  | "passwordChange";

export type Version = number | null;
