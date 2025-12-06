export interface PresenceUser {
  email: string;
  deviceCount: number;
}

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
  presenceUsers: PresenceUser[];
  userDevicesCount: number;
}

export type RecoveryStatus =
  | "linkExpired"
  | "accountRecovered"
  | "passwordChange";

export type Version = number | null;
