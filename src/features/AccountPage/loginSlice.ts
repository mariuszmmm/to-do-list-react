import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { UserData } from "../../types";
import { auth } from "../../utils/auth";

const loggedUsersEmail = auth.currentUser()?.email || null;

interface LoginState {
  logged: string | null;
  userData: UserData | null;
  recoverPassword: boolean;
  authMode: "login" | "register";
  fetchState: "idle" | "loading" | "error";
  errorMessage: string;
}

const initialState: LoginState = {
  logged: loggedUsersEmail,
  userData: null,
  recoverPassword: false,
  authMode: "login",
  fetchState: "idle",
  errorMessage: "",
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setLogged: (state, { payload: email }: PayloadAction<string>) => {
      state.logged = email;
    },
    setLogout: (state) => {
      state.logged = null;
      state.userData = null;
    },
    setUserData: (state, { payload: data }: PayloadAction<UserData | null>) => {
      state.userData = data;
    },
    setRecoverPassword: (
      state,
      { payload: recover }: PayloadAction<boolean>
    ) => {
      state.recoverPassword = recover;
    },
    setAuthMode: (
      state,
      { payload: mode }: PayloadAction<"login" | "register">
    ) => {
      state.authMode = mode;
    },
    loading: (state) => {
      state.fetchState = "loading";
      state.errorMessage = "";
    },
    fetchSuccess: (state) => {
      state.fetchState = "idle";
      state.errorMessage = "";
    },
    fetchError: (state) => {
      state.fetchState = "error";
    },
    setErrorMessage: (state, { payload: message }: PayloadAction<string>) => {
      state.errorMessage = message;
    },
  },
});

export const {
  setLogged,
  setLogout,
  setUserData,
  setRecoverPassword,
  setAuthMode,
  loading,
  fetchSuccess,
  fetchError,
  setErrorMessage,
} = loginSlice.actions;

const selectLoginState = (state: RootState) => state.login;

export const selectLogged = (state: RootState) =>
  selectLoginState(state).logged;
export const selectUserData = (state: RootState) =>
  selectLoginState(state).userData;
export const selectRecoverPassword = (state: RootState) =>
  selectLoginState(state).recoverPassword;
export const selectAuthMode = (state: RootState) =>
  selectLoginState(state).authMode;
export const selectFetchStatus = (state: RootState) =>
  selectLoginState(state).fetchState;
export const selectErrorMessage = (state: RootState) =>
  selectLoginState(state).errorMessage;

export default loginSlice.reducer;
