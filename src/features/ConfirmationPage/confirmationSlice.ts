import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";

const confirmationSlice = createSlice({
  name: "confirmation",
  initialState: {
    isConfirmation: false,
  },
  reducers: {
    setIsConfirmation: (state) => {
      state.isConfirmation = true;
    },
  },
});

export const { setIsConfirmation } = confirmationSlice.actions;

const selectConfirmationState = (state: RootState) => state.confirmation;
export const selectIsConfirmation = (state: RootState) =>
  selectConfirmationState(state).isConfirmation;

export default confirmationSlice.reducer;
