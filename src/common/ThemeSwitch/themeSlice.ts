import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { getSettingsFromLocalStorage } from "../../utils/localStorage";

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    isDarkTheme: getSettingsFromLocalStorage()?.isDarkTheme || false,
  },
  reducers: {
    toggleTheme: (state) => {
      state.isDarkTheme = !state.isDarkTheme;
    },
  },
});

export const { toggleTheme } = themeSlice.actions;

const selectThemeState = (state: RootState) => state.theme;
export const selectIsDarkTheme = (state: RootState) =>
  selectThemeState(state).isDarkTheme;

export default themeSlice.reducer;
