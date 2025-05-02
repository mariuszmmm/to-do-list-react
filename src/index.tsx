import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { ThemeProvider } from "styled-components";
import { I18nextProvider } from "react-i18next";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { store } from "./store";
import { theme } from "./theme/theme";
import GlobalStyle from "./theme/GlobalStyle";
import i18n from "./utils/i18n";
import App from "./App";
import { getTokenFromURL } from "./utils/getTokenFromURL";

const url = window.location.href;
getTokenFromURL(url);

const root = ReactDOM.createRoot(document.getElementById("root")!);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 3,
      refetchOnWindowFocus: false,
      refetchInterval: 1000 * 60 * 1,
      refetchOnMount: false,
    },
  },
});

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <I18nextProvider i18n={i18n}>
          <GlobalStyle />
          <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools />
            <App />
          </QueryClientProvider>
        </I18nextProvider>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
