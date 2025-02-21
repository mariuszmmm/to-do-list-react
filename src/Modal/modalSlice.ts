import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface ModalPayload {
  title?: string;
  message?: string;
  confirmButtonText?: string;
  endButtonText?: string;
  type?: "info" | "confirm" | "loading" | "success" | "error";
}

interface ModalState {
  isOpen: boolean;
  title?: string;
  message?: string;
  confirmButtonText?: string;
  endButtonText?: string;
  type?: "info" | "confirm" | "loading" | "success" | "error";
}

const initialState: ModalState = {
  isOpen: false,
  title: undefined,
  message: undefined,
  confirmButtonText: undefined,
  endButtonText: undefined,
  type: undefined,
};

export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (
      state,
      {
        payload: { title, message, confirmButtonText, endButtonText, type },
      }: PayloadAction<ModalPayload>
    ) => {
      state.isOpen = true;
      if (title) state.title = title;
      if (message) state.message = message;
      if (confirmButtonText) state.confirmButtonText = confirmButtonText;
      if (endButtonText) state.endButtonText = endButtonText;
      if (type) state.type = type;
    },
    closeModal: (state) => {
      state.isOpen = initialState.isOpen;
      state.title = initialState.title;
      state.message = initialState.message;
      state.confirmButtonText = initialState.confirmButtonText;
      state.endButtonText = initialState.endButtonText;
      state.type = initialState.type;
    },
    confirm: () => {},
    cancel: () => {},
  },
});

export const { openModal, closeModal, confirm, cancel } = modalSlice.actions;

export const selectModalState = (state: RootState) => state.modal;
export const selectModalIsOpen = (state: RootState) => state.modal.isOpen;

export default modalSlice.reducer;
