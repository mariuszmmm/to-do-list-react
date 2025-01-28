import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store";
import { ThemeProvider } from "styled-components";
import { theme } from "./theme";
import GlobalStyle from "./GlobalStyle";
import App from "./App";
import { saveUrlInLocalStorage } from "./utils/localStorage";

const url = window.location.href;
console.log("Current URL:", url);
saveUrlInLocalStorage(url);
window.location.href = "https://to-do-list-typescript-react.netlify.app/";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
