import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { AccountState } from "../../types";

const getInitialState = (): AccountState => ({
  accountMode: "login",
  isWaitingForConfirmation: false,
  loggedUserEmail: null,
  message: "",
  version: null,
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
        state.version = null;
      }
    },
    setMessage: (state, { payload: message }: PayloadAction<string>) => {
      state.message = message;
    },
    setVersion: (state, { payload: version }: PayloadAction<number | null>) => {
      state.version = version;
    },
  },
});

export const {
  setAccountMode,
  setIsWaitingForConfirmation,
  setLoggedUserEmail,
  setMessage,
  setVersion,
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

export default accountSlice.reducer;
