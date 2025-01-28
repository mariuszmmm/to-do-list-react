import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { User } from "../../types";
import { auth } from "./auth";

interface LoginState {
  user: User | null;
  authMode: "login" | "register";
  fetchState: "idle" | "loading" | "error";
  errorMessage: string;
}

const currentUser = auth.currentUser();

const initialState: LoginState = {
  user: !!currentUser
    ? {
        id: currentUser.id,
        email: currentUser.email,
        token: currentUser.token.access_token,
        lists: [],
      }
    : null,
  authMode: "login",
  fetchState: "idle",
  errorMessage: "",
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setUser: (state, { payload: user }: PayloadAction<User>) => {
      state.user = user;
    },
    setAuthMode: (
      state,
      { payload: mode }: PayloadAction<"login" | "register">
    ) => {
      state.authMode = mode;
    },
    logout: (state) => {
      state.user = null;
      state.fetchState = "idle";
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
  setUser,
  setAuthMode,
  logout,
  loading,
  fetchSuccess,
  fetchError,
  setErrorMessage,
} = loginSlice.actions;

const selectLoginState = (state: RootState) => state.login;

export const selectUser = (state: RootState) => selectLoginState(state).user;
export const selectAuthMode = (state: RootState) =>
  selectLoginState(state).authMode;
export const selectFetchStatus = (state: RootState) =>
  selectLoginState(state).fetchState;
export const selectErrorMessage = (state: RootState) =>
  selectLoginState(state).errorMessage;

export default loginSlice.reducer;
