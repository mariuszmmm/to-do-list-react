import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { AccountState, PresenceUser } from "../../types";

const getInitialState = (): AccountState => ({
  accountMode: "login",
  isWaitingForConfirmation: false,
  loggedUserEmail: null,
  loggedUserName: "",
  loggedUserRoles: [],
  message: "",
  presenceUsers: [],
  userDevicesCount: 0,
  totalUsersCount: 0,
  allDevicesCount: 0,
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
    setLoggedUser: (
      state,
      {
        payload,
      }: PayloadAction<{
        email: string | null;
        name?: string;
        roles?: AccountState["loggedUserRoles"];
      } | null>
    ) => {
      if (payload === null || payload.email === null) {
        state.loggedUserEmail = null;
        state.loggedUserName = "";
        state.loggedUserRoles = [];
        state.accountMode = "login";
        return;
      }
      state.loggedUserEmail = payload.email;
      state.loggedUserName = payload.name || "";
      state.loggedUserRoles = payload.roles || [];
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
        allDevices: number;
      }>
    ) => {
      state.presenceUsers = action.payload.users;
      state.userDevicesCount = action.payload.userDevices;
      state.totalUsersCount = action.payload.totalUsers;
      state.allDevicesCount = action.payload.allDevices;
    },
  },
});

export const {
  setAccountMode,
  setIsWaitingForConfirmation,
  setLoggedUser,
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
export const selectIsAdmin = (state: RootState) =>
  selectAccountState(state).loggedUserRoles.includes("admin");
export const selectMessage = (state: RootState) =>
  selectAccountState(state).message;
export const selectPresenceUsers = (state: RootState) =>
  selectAccountState(state).presenceUsers;
export const selectUserDevicesCount = (state: RootState) =>
  selectAccountState(state).userDevicesCount;
export const selectTotalUsersCount = (state: RootState) =>
  selectAccountState(state).totalUsersCount;
export const selectAllDevicesCount = (state: RootState) =>
  selectAccountState(state).allDevicesCount;

export default accountSlice.reducer;
