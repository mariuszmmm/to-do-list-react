import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { ModalTranslationKeys } from "../@types/i18next";
import langPl from "../utils/i18n/locales/pl";

interface ModalPayload {
  title?: string;
  message?: {
    key: ModalTranslationKeys<typeof langPl, "modal">;
    values?: Record<string, string>;
  };
  confirmButton?: string;
  endButton?: string;
  type?: "info" | "confirm" | "loading" | "success" | "error";
}

interface ModalState {
  isOpen: boolean;
  title?: string;
  message?: {
    key: ModalTranslationKeys<typeof langPl, "modal">;
    values?: Record<string, string>;
  };
  confirmButton?: string;
  endButton?: string;
  type?: "info" | "confirm" | "loading" | "success" | "error";
}

const initialState: ModalState = {
  isOpen: false,
  title: undefined,
  message: undefined,
  confirmButton: undefined,
  endButton: undefined,
  type: undefined,
};

export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (
      state,
      {
        payload: { title, message, confirmButton, endButton, type },
      }: PayloadAction<ModalPayload>
    ) => {
      state.isOpen = true;
      if (title) state.title = title;
      if (message) state.message = message;
      if (confirmButton) state.confirmButton = confirmButton;
      if (endButton) state.endButton = endButton;
      if (type) state.type = type;
    },
    closeModal: () => initialState,
    confirm: () => {},
    cancel: () => {},
  },
});

export const { openModal, closeModal, confirm, cancel } = modalSlice.actions;

export const selectModalState = (state: RootState) => state.modal;
export const selectModalIsOpen = (state: RootState) => state.modal.isOpen;

export default modalSlice.reducer;
