import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { I18nextProvider } from "react-i18next";
import { Provider } from "react-redux";
import { ThemeProvider } from "styled-components";
import { Normalize } from "styled-normalize";

import App from "./App";
import { store } from "./store";
import GlobalStyle from "./theme/GlobalStyle";
import { theme } from "./theme/theme";
import { getTokenFromURL } from "./utils/getTokenFromURL";
import i18n from "./utils/i18n";

const currentUrl = window.location.href;
getTokenFromURL(currentUrl);

const root = ReactDOM.createRoot(document.getElementById("root")!);
const queryClient = new QueryClient();

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <I18nextProvider i18n={i18n}>
          <Normalize />
          <GlobalStyle />
          <QueryClientProvider client={queryClient}>
            {process.env.NODE_ENV === "development" && <ReactQueryDevtools />}
            <App />
          </QueryClientProvider>
        </I18nextProvider>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
