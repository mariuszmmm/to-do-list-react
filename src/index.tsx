import React from "react";
import ReactDOM from "react-dom/client";
import { getTokenFromURL } from "./utils/getTokenFromURL";
import { Provider } from "react-redux";
import { store } from "./store";
import { ThemeProvider } from "styled-components";
import { theme } from "./theme/theme";
import { I18nextProvider } from "react-i18next";
import i18n from "./utils/i18n";
import GlobalStyle from "./theme/GlobalStyle";
import App from "./App";

const url = window.location.href;
getTokenFromURL(url);

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <I18nextProvider i18n={i18n}>
          <GlobalStyle />
          <App />
        </I18nextProvider>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
