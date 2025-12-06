import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { AccountState, PresenceUser } from "../../types";

const getInitialState = (): AccountState => ({
  accountMode: "login",
  isWaitingForConfirmation: false,
  loggedUserEmail: null,
  message: "",
  presenceUsers: [],
  userDevicesCount: 0,
});

const accountSlice = createSlice({
  name: "account",
  initialState: getInitialState(),
  reducers: {
    setAccountMode: (
      state,
      {
        payload: mode,
      }: PayloadAction<
        | "login"
        | "logged"
        | "passwordChange"
        | "accountRegister"
        | "accountRecovery"
        | "accountDelete"
        | "dataRemoval"
      >
    ) => {
      state.accountMode = mode;
      state.message = "";
    },
    setIsWaitingForConfirmation: (
      state,
      { payload }: PayloadAction<boolean>
    ) => {
      state.isWaitingForConfirmation = payload;
    },
    setLoggedUserEmail: (
      state,
      { payload: email }: PayloadAction<string | null>
    ) => {
      state.loggedUserEmail = email;
      if (email === null) {
        state.accountMode = "login";
      }
    },
    setMessage: (state, { payload: message }: PayloadAction<string>) => {
      state.message = message;
    },
    setPresenceData: (
      state,
      action: PayloadAction<{
        users: PresenceUser[];
        totalUsers: number;
        userDevices: number;
      }>
    ) => {
      state.presenceUsers = action.payload.users;
      state.userDevicesCount = action.payload.userDevices;
    },
  },
});

export const {
  setAccountMode,
  setIsWaitingForConfirmation,
  setLoggedUserEmail,
  setMessage,
  setPresenceData,
} = accountSlice.actions;

const selectAccountState = (state: RootState) => state.account;

export const selectAccountMode = (state: RootState) =>
  selectAccountState(state).accountMode;
export const selectIsWaitingForConfirmation = (state: RootState) =>
  selectAccountState(state).isWaitingForConfirmation;
export const selectLoggedUserEmail = (state: RootState) =>
  selectAccountState(state).loggedUserEmail;
export const selectMessage = (state: RootState) =>
  selectAccountState(state).message;
export const selectPresenceUsers = (state: RootState) =>
  state.account.presenceUsers;
export const selectUserDevicesCount = (state: RootState) =>
  state.account.userDevicesCount;
export const selectCurrentUserEmail = (state: RootState) =>
  state.account.loggedUserEmail;

export default accountSlice.reducer;
