import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { ModalTranslationKeys } from "../@types/i18next";
import langPl from "../utils/i18n/locales/pl";

interface ModalPayload {
  title: { key: ModalTranslationKeys<typeof langPl, "modal"> } | null;
  message:
    | {
        key: ModalTranslationKeys<typeof langPl, "modal">;
        values?: Record<string, string>;
      }
    | string;
  confirmButton?: { key: ModalTranslationKeys<typeof langPl, "modal.buttons"> };
  endButton?: { key: ModalTranslationKeys<typeof langPl, "modal.buttons"> };
  type: "info" | "confirm" | "loading" | "success" | "error" | "yes/no";
  confirmed?: boolean;
}

interface ModalState extends ModalPayload {
  isOpen: boolean;
}

const getInitialState = (): ModalState => ({
  isOpen: false,
  title: null,
  message: "",
  confirmButton: { key: "modal.buttons.confirmButton" },
  endButton: { key: "modal.buttons.closeButton" },
  type: "info",
  confirmed: undefined,
});

export const modalSlice = createSlice({
  name: "modal",
  initialState: getInitialState(),
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
      state.confirmed = undefined;
    },
    closeModal: () => getInitialState(),
    confirm: (state) => {
      state.confirmed = true;
    },
    cancel: (state) => {
      state.confirmed = false;
    },
  },
});

export const { openModal, closeModal, confirm, cancel } = modalSlice.actions;

export const selectModalState = (state: RootState) => state.modal;
export const selectModalIsOpen = (state: RootState) => state.modal.isOpen;
export const selectModalConfirmed = (state: RootState) => state.modal.confirmed;
export const selectModalType = (state: RootState) => state.modal.type;

export default modalSlice.reducer;
