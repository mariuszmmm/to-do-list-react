import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { AccountState } from "../../types";
import { auth } from "../../utils/auth";

const user = auth.currentUser();

const initialState: AccountState = {
  loggedUser: user?.email || null,
  accountMode: user ? "logged" : "login",
  fetchStatus: "idle",
  message: undefined,
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setLoggedUser: (
      state,
      { payload: email }: PayloadAction<string | null>
    ) => {
      state.loggedUser = email;
    },
    setAccountMode: (
      state,
      {
        payload: mode,
      }: PayloadAction<
        | "login"
        | "logged"
        | "changePassword"
        | "savePassword"
        | "registerAccount"
        | "sendRegisterEmail"
        | "deleteUser"
        | "accountRecovery"
        | "sendRecoveryEmail"
      >
    ) => {
      state.accountMode = mode;
      state.message = undefined;
    },
    loading: (state) => {
      state.fetchStatus = "loading";
      state.message = undefined;
    },
    fetchSuccess: (state) => {
      state.fetchStatus = "idle";
    },
    fetchError: (state) => {
      state.fetchStatus = "error";
    },
    setMessage: (
      state,
      { payload: message }: PayloadAction<AccountState["message"]>
    ) => {
      state.message = message;
    },
  },
});

export const {
  setLoggedUser,
  setAccountMode,
  loading,
  fetchSuccess,
  fetchError,
  setMessage,
} = accountSlice.actions;

const selectAccountState = (state: RootState) => state.account;

export const selectLoggedUser = (state: RootState) =>
  selectAccountState(state).loggedUser;
export const selectAccountMode = (state: RootState) =>
  selectAccountState(state).accountMode;
export const selectFetchStatus = (state: RootState) =>
  selectAccountState(state).fetchStatus;
export const selectMessage = (state: RootState) =>
  selectAccountState(state).message;

export default accountSlice.reducer;
